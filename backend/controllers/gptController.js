const OpenAI = require("openai");
const Course = require("../models/Course");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.getCourseSuggestions = async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log('===== GPT Request =====');
    console.log('Prompt:', prompt);

    // Check total courses in database
    const totalCourses = await Course.countDocuments();
    console.log('Total courses in database:', totalCourses);

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
    console.log('AI Reply:', aiReply);

    // Search for relevant courses based on keywords in the prompt
    // Extract keywords (simple approach: split by spaces and filter common words)
    const commonWords = ['i', 'want', 'to', 'learn', 'need', 'course', 'about', 'on', 'in', 'a', 'an', 'the', 'for', 'how', 'what', 'is', 'am', 'can', 'you', 'me', 'my', 'some', 'any', 'with', 'find', 'show', 'get'];
    const keywords = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));

    console.log('Extracted keywords:', keywords);

    // Search courses that match any keyword in title, description, or content
    let relevantCourses = [];
    if (keywords.length > 0) {
      // Build a single regex pattern from all keywords (OR logic)
      const keywordPattern = keywords.join('|');
      console.log('Search pattern:', keywordPattern);

      relevantCourses = await Course.find({
        $or: [
          { title: { $regex: keywordPattern, $options: 'i' } },
          { description: { $regex: keywordPattern, $options: 'i' } },
          { content: { $regex: keywordPattern, $options: 'i' } }
        ]
      }).populate('instructor', 'name email').limit(10);

      console.log('Found courses:', relevantCourses.length);
    } else {
      // If no specific keywords, return top 5 courses as general suggestions
      console.log('No keywords extracted, returning top courses');
      relevantCourses = await Course.find()
        .populate('instructor', 'name email')
        .limit(5);
      console.log('Fallback courses:', relevantCourses.length);
    }

    console.log('===== Response =====');
    console.log('Courses to send:', relevantCourses.length);
    console.log('Course titles:', relevantCourses.map(c => c.title));

    res.json({
      reply: aiReply,
      courses: relevantCourses
    });

  } catch (error) {
    console.error('GPT Controller Error:', error);
    res.status(500).json({ message: error.message });
  }
};
