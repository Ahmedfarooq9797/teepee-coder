import axios from "axios";

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = "sk-9NFHWzTU97hWD9xUaYvP72zpPdRmLQ47u7dU6LHuM6T3BlbkFJDzl-mcIsCC7bCinq9xgM4CPNk8kjRhSWyZFfubGTEA";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

export const generateQuestion = async (level) => {
  try {
    console.log("Generating question for level:", level);
    console.log("API Key:", process.env.REACT_APP_OPENAI_API_KEY ? "Present" : "Missing");

    const prompt = `
You are an expert GCSE Computer Science tutor.

Generate a ${level} difficulty GCSE Computer Science Python coding question similar to the Edexcel GCSE paper 2, question 5. Include a partially completed Python code snippet that the student needs to complete. The question should involve tasks such as writing data to a file, string formatting, working with lists (1D and 2D), or loading data from a file.

Format your response as a JSON object with the following structure:

{
  "question": "Question text including the partially completed code snippet",
  "concept": "The key concept being assessed"
}

Do not include any additional text or explanations outside the JSON object.
`;

    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      },
      { headers }
    );

    console.log("API Response:", response.data);

    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error("No choices returned from OpenAI API");
    }

    const responseText = response.data.choices[0].message?.content ?? "";
    console.log("Text received from OpenAI:", responseText);

    // Parse the JSON response
    let questionData;
    try {
      questionData = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      throw new Error("Failed to parse JSON from OpenAI response");
    }

    // Validate the question structure
    if (!questionData.question || !questionData.concept) {
      throw new Error("Invalid question format received");
    }

    return questionData;
  } catch (error) {
    console.error("Error generating question:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

export const evaluateCode = async (studentCode, prompt) => {
  // Function to remove Python comments
  const removeComments = (code) => {
    // Remove multi-line comments
    code = code.replace(/'''[\s\S]*?'''/g, "");
    code = code.replace(/"""[\s\S]*?"""/g, "");

    // Remove single-line comments
    code = code
      .split("\n")
      .map((line) => line.split("#")[0].trim())
      .filter(Boolean)
      .join("\n");

    return code;
  };

  // Remove comments from student code
  const cleanedStudentCode = removeComments(studentCode);

  const prompt2 = `Original Question for the Student:

A program is required to calculate the total and average of a series of numbers. The program should first ask how many numbers the user wants to enter, then collect that many numbers, and finally calculate and display both the total and average.

The table shows test data for a functional program:

Input                | Output
---------------------|----------------------
Quantity: 3          | Total: 6
Numbers: 1, 2, 3     | Average: 2.0

Quantity: 4          | Total: 10
Numbers: 2, 3, 2, 3  | Average: 2.5

Amend the code shown below to:
1. Ask for and store the quantity of numbers
2. Create a loop to input the specified number of values
3. Calculate the running total within the loop
4. Calculate and display the average after the loop
Do not add any additional functionality.

Unedited Original Code:

# Get quantity of numbers
=====> Add lines to get and store the quantity
num = 

# Initialize total
total = 0

# Input loop
=====> Add loop structure to get numbers
[Your loop here]
    temp = 
    total = 

# Calculate and display results
=====> Add lines to calculate and display total and average

<student_response>
${cleanedStudentCode}
</student_response>

Evaluation Instructions:

- Evaluate the student response carefully, considering the possibility that they may use pseudocode, OCR reference language, or any other programming language in their answer.
- It is crucial to interpret the code, regardless of its format, and provide a correct evaluation based on the problem's requirements.
- Ensure that the answer's logic, syntax (where applicable), and structure are assessed properly, regardless of the language or format used by the student.
- Please give feedback that aligns with the actual programming concepts and requirements in the provided question.
- Always address the audience (students) directly using 'you' in every interaction, avoiding any reference to them in the third person (e.g., 'they,' 'students'). Keep the tone conversational, engaging, and personalized, ensuring that all instructions, feedback, and content are framed in the second person perspective.
- For flowchart solutions, check for appropriate shape usage.
- Allow for follow-through marking where specified.
- Evaluate only what is between <student_response> and </student_response> tags as the student's response.
- Carefully compare the student's code with the original code to identify any modifications or completions.
- For each criterion, provide an explanation that specifically addresses that criterion's requirements.
- Evaluate each criterion independently.

JSON Output Format:
{
  ""totalMark"": X,
  ""markingBreakdown"": [
    {
      ""criterionNumber"": ""1"",
      ""criterionDescription"": ""Input Quantity"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""2"",
      ""criterionDescription"": ""Loop Attempt"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""3"",
      ""criterionDescription"": ""Correct Repetition"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""4"",
      ""criterionDescription"": ""Total Calculation"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""5"",
      ""criterionDescription"": ""Average Calculation"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""6"",
      ""criterionDescription"": ""Result Output"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    }
  ],
  ""suggestions"": [
    ""Specific improvement suggestion 1"",
    ""Specific improvement suggestion 2""
  ],
  ""overallComment"": ""Summary of the student's modifications and key areas to focus on""
}

IMPORTANT NOTES FOR RESPONSE:

Respond ONLY with JSON, formatted as specified above. Do not provide any additional text outside of the JSON.
Evaluate only what is between <student_response> and </student_response> tags as the student's response. Ignore any content outside these tags.
Ensure that the criterionDescription in each marking breakdown item exactly matches the descriptions provided in the Criteria Breakdown section above.
- Pay close attention to loop implementation and calculations.
- Accept any valid looping construct that achieves the required functionality.
- Consider both code-based and flowchart solutions as valid approaches.
- Allow for follow-through marking as specified in the marking scheme.

Criteria Breakdown (6 Marks Total):

1. Input Quantity (1 mark)
   Description: Check for input with message and proper storage
   Expected Code: Any valid input with message and storage
   Mark: 1 if input is taken with message and stored; otherwise, 0.
   Note: Can be two statements (print then input) or combined

2. Loop Attempt (1 mark)
   Description: Check for attempt at creating a loop structure
   Expected Code: Any valid loop structure (for/while)
   Mark: 1 if loop structure is attempted; otherwise, 0.

3. Correct Repetition (1 mark)
   Description: Check that loop repeats correct number of times
   Expected Code: Correct loop count matching input
   Mark: 1 if loop count is correct (±1 tolerance); otherwise, 0.

4. Total Calculation (1 mark)
   Description: Check for correct running total calculation
   Expected Code: total = total + temp (or equivalent)
   Mark: 1 if total calculation is correct; otherwise, 0.

5. Average Calculation (1 mark)
   Description: Check for correct average calculation
   Expected Code: total / num (or equivalent)
   Mark: 1 if average calculation is attempted (follow-through); otherwise, 0.

6. Result Output (1 mark)
   Description: Check for output of both total and average
   Expected Code: Print statements for both values
   Mark: 1 if both results are output (follow-through); otherwise, 0.

Special Notes:
- BP1 requires input with message (can be two statements or combined)
- BP3, 4, 5 must be logically correct to be credited
- Allow tolerance of 1 with number of loops for BP3
- Ignore non-initialization of total variable
- Follow-through marking applies for BP5 if total calculation attempted
- Follow-through marking applies for BP6 if total and average calculations attempted
- For flowchart solutions, correct shapes must be used

0 marks category:
- Incorrect answer
- Answer containing gibberish characters
- Irrelevant answer

1-5 marks category:
- Partial implementation with some correct operations
- Each correct operation earns 1 mark

6 marks category:
- All operations implemented correctly
- Complete solution with proper logic flow

Note: Accept any other valid responses that demonstrate understanding of number processing and loop concepts, regardless of the implementation method used.`;

  console.log("Prompt being sent to OpenAI:");
  console.log(prompt);

  try {
    console.log("prompt here", prompt);
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt ? prompt : prompt2 }],
        max_tokens: 3000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Raw API response:", response.data);

    const content = response.data.choices[0].message.content;
    console.log("API response content:", content);

    // Remove markdown code block syntax if present
    const jsonContent = content.replace(/```json\n|\n```/g, "").trim();

    try {
      const feedbackData = JSON.parse(jsonContent);
      console.log("Parsed feedback data:", feedbackData);
      return feedbackData;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return {
        totalMark: 0,
        markingBreakdown: [],
        suggestions: [],
        overallComment: "Failed to parse JSON from OpenAI response: " + jsonContent.slice(0, 100) + "...",
      };
    }
  } catch (error) {
    console.error("Error in evaluateCode:", error);
    throw error;
  }
};
