const OpenAI = require("openai");
const Course = require("../models/Course");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.getCourseSuggestions = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Get AI response
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful educational advisor who suggests online courses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    const aiReply = completion.choices[0].message.content;

    // Search for relevant courses based on keywords in the prompt
    // Extract keywords (simple approach: split by spaces and filter common words)
    const commonWords = ['i', 'want', 'to', 'learn', 'need', 'course', 'about', 'on', 'in', 'a', 'an', 'the', 'for', 'how', 'what', 'is', 'am', 'can', 'you', 'me', 'my'];
    const keywords = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));

    // Search courses that match any keyword in title, description, or content
    let relevantCourses = [];
    if (keywords.length > 0) {
      // Create regex patterns for each keyword
      const regexQueries = keywords.map(keyword => ({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } }
        ]
      }));

      relevantCourses = await Course.find({
        $or: regexQueries
      }).populate('instructor', 'name email').limit(10);
    }

    res.json({
      reply: aiReply,
      courses: relevantCourses
    });

  } catch (error) {
    console.error('GPT Controller Error:', error);
    res.status(500).json({ message: error.message });
  }
};
