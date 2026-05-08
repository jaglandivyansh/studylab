export default async function handler(req, res) {
  const key = process.env.GNEWS_API_KEY;
  const url = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=in&max=5&apikey=${key}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
}