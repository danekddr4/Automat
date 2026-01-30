const express = require('express');
const stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Inicializace Stripe s tajným klíčem
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());

// Použijeme JSON parser pro vše kromě webhooku, který potřebuje raw body
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});
app.use(bodyParser.urlencoded({ extended: true }));

// Servírování statických souborů (frontend)
app.use(express.static(path.join(__dirname)));

// Jednoduchá in-memory fronta pro zaplacené produkty
// V reálné aplikaci by zde byla databáze (SQLite, MySQL, atd.)
let pendingDispenses = [];

// Route pro vytvoření Stripe Checkout Session
app.post('/create-payment', async (req, res) => {
  const { PRODUCT_ID, NAME } = req.body;
  const domain = process.env.DOMAIN || 'http://localhost:3000';

  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'czk',
            product_data: {
              name: NAME || 'Nápoj',
            },
            unit_amount: 3000, // 30.00 CZK (částka v haléřích)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${domain}/index.html?status=1`,
      cancel_url: `${domain}/index.html?status=2`,
      metadata: {
        product_pin: PRODUCT_ID // Uložíme PIN produktu do metadat
      }
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error('Chyba při vytváření platby:', error);
    res.redirect(`${domain}/index.html?status=2`);
  }
});

// Stripe Webhook - poslouchá potvrzení o zaplacení
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripeClient.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Zpracování události zaplacení
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Získáme PIN produktu z metadat
    const productPin = session.metadata.product_pin;
    
    if (productPin) {
      console.log(`Platba přijata pro produkt na pinu: ${productPin}`);
      // Přidáme do fronty k vydání
      pendingDispenses.push({
        pin: parseInt(productPin),
        timestamp: Date.now()
      });
    }
  }

  response.send();
});

// API pro ESP32 - zjištění, zda má něco vydat
app.get('/api/poll', (req, res) => {
  // Pokud je něco ve frontě, vrátíme to a odstraníme z fronty
  if (pendingDispenses.length > 0) {
    const action = pendingDispenses.shift(); // Vyzvedne nejstarší požadavek
    console.log(`ESP32 si vyzvedlo akci pro pin ${action.pin}`);
    res.json({
      trigger: action.pin,
      duration: 5000 // 5 sekund
    });
  } else {
    res.json({ trigger: null });
  }
});

// Spuštění serveru
app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});
