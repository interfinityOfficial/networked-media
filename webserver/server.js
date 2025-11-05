// Importing the libraries
const express = require('express');
const { IP2Location } = require("ip2location-nodejs");
const { PrismaClient } = require('@prisma/client');
const ejs = require('ejs');

const dotenv = require('dotenv');
dotenv.config();

const prisma = new PrismaClient();

// Create the web server on port 3003
let app = express();
const PORT = process.env.PORT || 3006;

// Tell the web server to use the "public" folder for serving static files (html, css, javascript, media.)
app.use(express.static('public'));

// Let Express parse the body of the request
app.use(express.json());

// Let Express trust the Nginx proxy
app.set('trust proxy', true);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Project 4 Page
app.get('/project4/', async (req, res) => {
  const posts = await prisma.post.findMany();
  res.render('project4', { posts: posts });
});

// Project 4 API
app.get('/api/project4/', async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json({ allPosts: posts });
});

app.post('/api/project4/', async (req, res) => {
  const { content } = req.body;
  const post = await prisma.post.create({
    data: { content: content },
  });
  res.json({ post: post });
});

app.delete('/api/project4/', async (req, res) => {
  const { id } = req.body;
  await prisma.post.delete({
    where: { id: id },
  });
  res.json({ success: true });
});

// Initialize IP2Location
let ip2location = new IP2Location();
ip2location.open("public/assets/IP2LOCATION-LITE-DB3.IPV6.BIN");

// Get IP Address API endpoint
app.get('/api/ip/', (req, res) => {
  let ip =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    "";

  // For testing
  // ip = "2600:1f18:39b0:4b00:cf30:71ba:3282:f080";

  let city = "Localhost"
  let country = "Your Computer"

  // Handle IPv4 mapped in IPv6
  if (ip.includes("::ffff:")) {
    ip = ip.split("::ffff:")[1];
  }

  // Handle IPv6 format
  if (ip.startsWith("[") && ip.endsWith("]")) {
    ip = ip.slice(1, -1);
  }

  // Handle localhost
  if (["127.0.0.1", "::1", "localhost"].includes(ip)) {
    ip = "127.0.0.1";
  } else {
    let data = ip2location.getAll(ip);
    city = data.city;
    country = data.countryLong;
  }


  // Remove port if present
  if (ip.includes(":")) {
    const parts = ip.split(":");
    if (parts.length > 1 && !ip.includes(".")) {
      // IPv6 address, keep as is
    } else {
      // IPv4 with port
      ip = parts[0];
    }
  }

  res.json({
    ip,
    city,
    country,
  });
});

app.listen(PORT, function () {
  console.log('Webserver listening on port ' + PORT + '!')
});