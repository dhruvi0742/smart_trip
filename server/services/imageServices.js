const axios = require("axios");

const UNSPLASH_KEY = "YOUR_ACCESS_KEY";

const cleanQuery = (text) => {

  // Remove unwanted words
  return text
    .replace(/visit|explore|enjoy|with|and|the|a|in/gi, "")
    .replace(/[^a-zA-Z\s]/g, "")
    .trim();
};

const getPlaceImage = async (place) => {

  try {

    const cleaned = cleanQuery(place);

    const query = `${cleaned} tourism`;

    const res = await axios.get(
      "https://api.unsplash.com/search/photos",
      {
        params: {
          query,
          per_page: 1
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_KEY}`
        }
      }
    );

    return res.data.results[0]?.urls?.regular || null;

  } catch (err) {
    return null;
  }

};

module.exports = { getPlaceImage };