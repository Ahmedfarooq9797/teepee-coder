import React, { useState, useMemo, useEffect, useRef } from "react";
import QuestionDisplay from "../components/QuestionDisplay";
import CodeEditor from "../components/CodeEditor";
import FeedbackDisplay from "../components/FeedbackDisplay";
import { evaluateCode } from "../services/openaiService";
import { ToastContainer, toast } from "react-toastify";
import amplitude from "amplitude-js";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import { useLocation } from "react-router-dom";
import shareIcon from "../images/share_icon.svg";
const QuestionPages = () => {
  const cleanedStudentCode = useRef();
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const questionsData = [
    {
      id: 1,
      question: `<div class="">
  <p>The 'higher or lower' game contains two players. The first is the <b>'guesser'</b> and the second is the <b>'setter'</b>. The setter chooses an integer between <b>1 and 100</b> (inclusive), and the guesser tries to guess the number. The setter responds with <b>"higher"</b> if the guess was too low and <b>"lower"</b> if the guess was too high.</p>
  
  <p>Write a program in pseudocode to play a simplified version of the game where the guesser can only guess once. The program should:</p>
  
  <ul>
    <li>Input the real number and the guessed number without a prompt.</li>
    <li>Output <b>'higher'</b>, <b>'lower'</b>, or <b>'correct'</b> based on the guess.</li>
  </ul>
</div>
`,
      initialCode: ``,
      prompt: `Original Question for the Student:

A program is required for a simplified version of the ""higher or lower"" game. In this game, there are two players: a ""setter"" who chooses a number, and a ""guesser"" who tries to guess it. The program should take two inputs: the setter's number (between 1 and 100 inclusive) and the guesser's guess. It should then output whether the guess was ""higher"", ""lower"", or ""correct"".

The table shows test data for a functional program:

Input        | Output
-------------|--------
50, 75       | lower
50, 25       | higher
50, 50       | correct
1, 100       | lower
100, 1       | higher

Amend the code shown below to:
1. Take two inputs without prompts for the real number and guess
2. Compare the numbers using if/else statements
3. Output the appropriate message
Do not add any additional functionality.

Unedited Original Code:

# Input section
=====> Add lines to get both numbers
num = 
guess = 

# Comparison section
=====> Add the if statement
if 

=====> Add the else if statement

=====> Add the else statement

<student_response>
{cleanedStudentCode.current}
</student_response>

Evaluation Instructions:

- Evaluate the student response carefully, considering the possibility that they may use pseudocode, OCR reference language, or any other programming language in their answer.
- It is crucial to interpret the code, regardless of its format, and provide a correct evaluation based on the problem's requirements.
- Ensure that the answer's logic, syntax (where applicable), and structure are assessed properly, regardless of the language or format used by the student.
- Please give feedback that aligns with the actual programming concepts and requirements in the provided question.
- Always address the audience (students) directly using 'you' in every interaction, avoiding any reference to them in the third person (e.g., 'they,' 'students'). Keep the tone conversational, engaging, and personalized, ensuring that all instructions, feedback, and content are framed in the second person perspective.
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
      ""criterionDescription"": ""Input Implementation"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""2"",
      ""criterionDescription"": ""Higher Condition"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""3"",
      ""criterionDescription"": ""Lower Condition"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""4"",
      ""criterionDescription"": ""Correct Condition"",
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
Evaluate only what is between the <student_response> and </student_response> tags as the student's response. Ignore any content outside these tags.
Ensure that the criterionDescription in each marking breakdown item exactly matches the descriptions provided in the Criteria Breakdown section above.
- Pay close attention to logic and flow regardless of syntax used.
- Accept any valid programming constructs that achieve the required functionality.
- Consider pseudocode and different programming languages as valid approaches.

Criteria Breakdown (4 Marks Total):

Input Implementation (1 mark)
Description: Check for correct input of both numbers
Expected Code: Any valid input implementation (e.g., input(), read, get, etc.)
Mark: 1 if both inputs are obtained correctly; otherwise, 0.
Higher Condition (1 mark)
Description: Check for correct implementation of the ""higher"" condition
Expected Code: Any valid condition checking if guess < num
Mark: 1 if condition and output are correct; otherwise, 0.
Lower Condition (1 mark)
Description: Check for correct implementation of the ""lower"" condition
Expected Code: Either an explicit check (guess > num) OR an else statement after checking other conditions
Note: An else statement is valid here as it logically covers the remaining case where guess > num
Mark: 1 if condition (explicit or implicit using else) and output are correct; otherwise, 0.
Correct Condition (1 mark)
Description: Check for correct implementation of the ""correct"" condition
Expected Code: Any valid condition checking if guess equals num
Mark: 1 if condition and output are correct; otherwise, 0.

Special Notes:

The order of conditions matters only when using else statements
For the Lower Condition, both explicit (if guess > num) and implicit (else after checking other cases) implementations are equally valid
When using else for the Lower Condition, ensure that other conditions (equal and less than) are checked first

0 marks category:
- Incorrect answer
- Answer containing gibberish characters
- Irrelevant answer

1-3 marks category:
- Partial implementation with some correct conditions
- Each correct implementation earns 1 mark

4 marks category:
- All conditions implemented correctly
- Complete solution with correct logic flow

Note: Accept any other valid responses that demonstrate understanding of the game logic, regardless of programming language or format used.`,
    },
    {
      id: 2,
      question: `<p>
  Given the strings <code>x = 'Hello'</code> and <code>y = 'World'</code>, write a line of code that would produce the result 
  <code>'lloWor'</code> using both string slicing and concatenation.
</p>
`,
      initialCode: ``,
      prompt: `Original Question for the Student:

Given the strings x = ""Hello"" and y = ""World"", write a line of code that would produce the result ""lloWor"" using both string slicing and concatenation.

The table shows test data for a functional program:

Input               | Output
--------------------|--------
x=""Hello"", y=""World""| ""lloWor""

Amend the code shown below to:
1. Slice appropriate parts from both strings
2. Concatenate the sliced parts
Do not add any additional functionality.

Unedited Original Code:

# Given strings
x = ""Hello""
y = ""World""

# Slice and concatenate
=====> Add a line to create ""lloWor"" using slicing and concatenation
result = 

<student_response>
{cleanedStudentCode.current}
</student_response>

Evaluation Instructions:

- Evaluate the student response carefully, considering the possibility that they may use pseudocode, OCR reference language, or any other programming language in their answer.
- It is crucial to interpret the code, regardless of its format, and provide a correct evaluation based on the problem's requirements.
- Ensure that the answer's logic, syntax (where applicable), and structure are assessed properly, regardless of the language or format used by the student.
- Please give feedback that aligns with the actual programming concepts and requirements in the provided question.
- Always address the audience (students) directly using 'you' in every interaction, avoiding any reference to them in the third person (e.g., 'they,' 'students'). Keep the tone conversational, engaging, and personalized, ensuring that all instructions, feedback, and content are framed in the second person perspective.
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
      ""criterionDescription"": ""String Slicing"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""2"",
      ""criterionDescription"": ""String Concatenation"",
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
Evaluate only what is between the <student_response> and </student_response> tags as the student's response. Ignore any content outside these tags.
Ensure that the criterionDescription in each marking breakdown item exactly matches the descriptions provided in the Criteria Breakdown section above.
- Pay close attention to string manipulation syntax used.
- Accept any valid string manipulation functions that achieve the required result.
- Consider different string slicing methods as valid approaches.

Criteria Breakdown (2 Marks Total):

1. String Slicing (1 mark)
   Description: Check for correct extraction of substrings from both strings
   Expected Code: Any valid slicing method (e.g., substring(x, 3), right(x, 3), x[2:], etc.)
   Mark: 1 if slicing operations are correct for both strings; otherwise, 0.

2. String Concatenation (1 mark)
   Description: Check for correct joining of the sliced strings
   Expected Code: Any valid concatenation method (e.g., using +, concat(), etc.)
   Mark: 1 if concatenation is implemented correctly; otherwise, 0.

0 marks category:
- Incorrect answer
- Answer containing gibberish characters
- Irrelevant answer

1 mark category:
- Correct implementation of either slicing OR concatenation
- Partial solution that demonstrates understanding of one concept

2 marks category:
- Correct implementation of both slicing AND concatenation
- Complete solution that produces ""lloWor""

Note: Accept any other valid responses that demonstrate understanding of string manipulation concepts, regardless of the specific functions or methods used.`,
    },
    {
      id: 3,
      question: ` <p>
    Write a program in OCR Exam Reference Language that performs the following tasks:
    <ol>
      <li>Opens a file named <code>"data.txt"</code> for reading.</li>
      <li>Reads the first line from the file and stores it in a variable named <code>firstLine</code>.</li>
      <li>Prints the content of <code>firstLine</code> to the output.</li>
      <li>Closes the file.</li>
    </ol>
  </p>`,
      initialCode: ``,
      prompt: `Original Question for the Student:

A program is required to read content from a text file. The program should open a file named ""data.txt"", read its first line into a variable, display the content, and then close the file properly.

The table shows test data for a functional program:

Input file (data.txt) | Output
---------------------|--------
""Hello World""        | Hello World
""Test Data""          | Test Data
""""                   | """"

Amend the code shown below to:
1. Open the file ""data.txt"" for reading
2. Read and store the first line in firstLine variable
3. Print the stored content
4. Close the file
Do not add any additional functionality.

Unedited Original Code:

# File operations
=====> Add a line to open the file
file = 

=====> Add a line to read and store the first line
firstLine = 

=====> Add a line to print the content

=====> Add a line to close the file

<student_response>
{cleanedStudentCode.current}
</student_response>

Evaluation Instructions:

- Evaluate the student response carefully, considering the possibility that they may use pseudocode, OCR reference language, or any other programming language in their answer.
- It is crucial to interpret the code, regardless of its format, and provide a correct evaluation based on the problem's requirements.
- Ensure that the answer's logic, syntax (where applicable), and structure are assessed properly, regardless of the language or format used by the student.
- Please give feedback that aligns with the actual programming concepts and requirements in the provided question.
- Always address the audience (students) directly using 'you' in every interaction, avoiding any reference to them in the third person (e.g., 'they,' 'students'). Keep the tone conversational, engaging, and personalized, ensuring that all instructions, feedback, and content are framed in the second person perspective.
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
      ""criterionDescription"": ""File Opening"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""2"",
      ""criterionDescription"": ""Line Reading"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""3"",
      ""criterionDescription"": ""Content Display"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""4"",
      ""criterionDescription"": ""File Closing"",
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
Evaluate only what is between the <student_response> and </student_response> tags as the student's response. Ignore any content outside these tags.
Ensure that the criterionDescription in each marking breakdown item exactly matches the descriptions provided in the Criteria Breakdown section above.
- Pay close attention to file handling operations and syntax used.
- Accept any valid file handling methods that achieve the required functionality.
- Consider different programming languages' file handling approaches as valid.

Criteria Breakdown (4 Marks Total):

1. File Opening (1 mark)
   Description: Check for correct file opening operation
   Expected Code: Any valid file opening method (e.g., open(), fopen(), etc.)
   Mark: 1 if file is opened correctly for reading; otherwise, 0.

2. Line Reading (1 mark)
   Description: Check for correct reading of first line from file
   Expected Code: Any valid line reading method (e.g., readLine(), getline(), etc.)
   Mark: 1 if line reading is implemented correctly; otherwise, 0.

3. Content Display (1 mark)
   Description: Check for correct printing of stored content
   Expected Code: Any valid print/output statement
   Mark: 1 if content is displayed correctly; otherwise, 0.

4. File Closing (1 mark)
   Description: Check for proper file closure
   Expected Code: Any valid file closing method (e.g., close(), fclose(), etc.)
   Mark: 1 if file is closed correctly; otherwise, 0.

0 marks category:
- Incorrect answer
- Answer containing gibberish characters
- Irrelevant answer

1-3 marks category:
- Partial implementation with some correct file operations
- Each correct operation earns 1 mark

4 marks category:
- All file operations implemented correctly
- Complete solution with proper file handling

Note: Accept any other valid responses that demonstrate understanding of file handling concepts, regardless of programming language or specific methods used.`,
    },
    {
      id: 4,
      question: ` <p>
    Write a program in OCR Exam Reference Language that performs the following tasks:
    <ol>
      <li>Generates a random integer between <code>1</code> and <code>100</code>.</li>
      <li>Stores the random number in a variable named <code>randomNumber</code>.</li>
      <li>Prints the value of <code>randomNumber</code> to the output.</li>
    </ol>
  </p>`,
      initialCode: ``,
      prompt: `Original Question for the Student:

A program is required to generate, store, and display a random number. The program should generate a random integer between 1 and 100 (inclusive), store it in a variable, and display it to the user.

The table shows example outputs for a functional program:

Output Examples
--------------
42
87
13
(Any number between 1 and 100 is valid)

Amend the code shown below to:
1. Generate a random integer between 1 and 100
2. Store it in a variable named randomNumber
3. Print the value of randomNumber
Do not add any additional functionality.

Unedited Original Code:

# Generate random number
=====> Add a line to generate and store random number
randomNumber = 

# Display result
=====> Add a line to print the random number

<student_response>
{cleanedStudentCode.current}
</student_response>

Evaluation Instructions:

- Evaluate the student response carefully, considering the possibility that they may use pseudocode, OCR reference language, or any other programming language in their answer.
- It is crucial to interpret the code, regardless of its format, and provide a correct evaluation based on the problem's requirements.
- Ensure that the answer's logic, syntax (where applicable), and structure are assessed properly, regardless of the language or format used by the student.
- Please give feedback that aligns with the actual programming concepts and requirements in the provided question.
- Always address the audience (students) directly using 'you' in every interaction, avoiding any reference to them in the third person (e.g., 'they,' 'students'). Keep the tone conversational, engaging, and personalized, ensuring that all instructions, feedback, and content are framed in the second person perspective.
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
      ""criterionDescription"": ""Random Number Generation"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""2"",
      ""criterionDescription"": ""Variable Storage"",
      ""initialCode"": ""..."",
      ""expectedCode"": ""..."",
      ""studentCode"": ""..."",
      ""markAwarded"": 0 or 1,
      ""explanation"": ""...""
    },
    {
      ""criterionNumber"": ""3"",
      ""criterionDescription"": ""Output Display"",
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
Evaluate only what is between the <student_response> and </student_response> tags as the student's response. Ignore any content outside these tags.
Ensure that the criterionDescription in each marking breakdown item exactly matches the descriptions provided in the Criteria Breakdown section above.
- Pay close attention to random number generation syntax used.
- Accept any valid random number generation methods that achieve the required result.
- Consider different programming approaches for random number generation as valid.

Criteria Breakdown (3 Marks Total):

1. Random Number Generation (1 mark)
   Description: Check for correct random number generation in specified range
   Expected Code: Any valid random number generation method (e.g., random(), rand(), etc.)
   Mark: 1 if random number generation is implemented correctly; otherwise, 0.

2. Variable Storage (1 mark)
   Description: Check for correct storage in variable named randomNumber
   Expected Code: randomNumber = [random number generation code]
   Mark: 1 if variable assignment is correct; otherwise, 0.

3. Output Display (1 mark)
   Description: Check for correct printing of the random number
   Expected Code: Any valid print statement (e.g., print(randomNumber))
   Mark: 1 if output display is implemented correctly; otherwise, 0.

0 marks category:
- Incorrect answer
- Answer containing gibberish characters
- Irrelevant answer

1-2 marks category:
- Partial implementation with some correct operations
- Each correct operation earns 1 mark

3 marks category:
- All operations implemented correctly
- Complete solution with proper random number handling

Note: Accept any other valid responses that demonstrate understanding of random number generation concepts, regardless of programming language or specific methods used.`,
    },
    {
      id: 5,
      question: `<p>Write an algorithm to perform the following steps:</p>
      <ol style={{ lineHeight: "1.8", fontSize: "16px" }}>
        <li>Ask the user to input the quantity of numbers they want to enter and read this value as input.</li>
        <li>Repeatedly take a number as input until the quantity of numbers the user has specified has been entered.</li>
        <li>Calculate and output the total of these numbers.</li>
        <li>Calculate and output the average of these numbers.</li>
      </ol>`,
      initialCode: ``,
      prompt: `Original Question for the Student:

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
{cleanedStudentCode.current}
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

Note: Accept any other valid responses that demonstrate understanding of number processing and loop concepts, regardless of the implementation method used.`,
    },
  ];

  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const feedbackRef = useRef(null);
  const query = new URLSearchParams(location.search);
  const questionId = query.get("question"); // Extract question id from URL
  const [questions, setQuestions] = useState(
    questionsData
      .filter((q, index) => !questionId || Number(questionId) === index + 1) // Filter condition
      .map((q) => ({ ...q, code: q.initialCode, feedback: null, isLoading: false, isEdited: false }))
  );
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

  // Handle code change for a specific question
  const handleCodeChange = (index, newCode) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, i) =>
        i === index ? { ...question, code: newCode, isEdited: newCode !== question.initialCode && newCode.trim() !== "" } : question
      )
    );
  };

  const handleSubmit = async (index) => {
    const currentQuestion = questions[index];
    let cleancode = currentQuestion.code;
    setEmail("");
    if (studentName) {
      amplitude.getInstance().setUserId(studentName);
      amplitude.getInstance().logEvent("OCR p2 student Name");
    }
    // Remove comments and assign the cleaned code to the ref
    cleanedStudentCode.current = removeComments(cleancode);
    console.log("cleaned code is", JSON.stringify(cleanedStudentCode.current));
    setQuestions((prevQuestions) => prevQuestions.map((question, i) => (i === index ? { ...question, feedback: null } : question)));
    if (!currentQuestion.isEdited) return;

    setQuestions((prevQuestions) => prevQuestions.map((question, i) => (i === index ? { ...question, isLoading: true } : question)));

    // Update the prompt with cleanedStudentCode in place of the student's original response
    const promptWithCleanedCode = currentQuestion.prompt.replace("{cleanedStudentCode.current}", cleanedStudentCode.current);

    console.log("Updated prompt with cleaned code:", promptWithCleanedCode);

    try {
      // Pass cleaned code into evaluateCode function
      const feedbackData = await evaluateCode(cleanedStudentCode.current, promptWithCleanedCode);
      setQuestions((prevQuestions) =>
        prevQuestions.map((question, i) => (i === index ? { ...question, feedback: feedbackData, isLoading: false } : question))
      );
    } catch (error) {
      console.error("Error evaluating code:", error);
      setQuestions((prevQuestions) =>
        prevQuestions.map((question, i) =>
          i === index
            ? {
                ...question,
                feedback: {
                  totalMark: 0,
                  markingBreakdown: [],
                  suggestions: ["An error occurred. Please try again."],
                  overallComment: "Unable to evaluate the code due to an error.",
                },
                isLoading: false,
              }
            : question
        )
      );
    }
  };
  const sendEmail = async (email, questionsData) => {
    setIsLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex

    if (!emailRegex.test(email)) {
      setIsLoading(false);
      alert("Please enter a valid email address.");
      return;
    }
    if (studentName.length === 0) {
      setIsLoading(false);
      alert("Please Enter Student name for email");
      return;
    }
    try {
      const response = await fetch("https://staging.teepee.ai/teepee_web_server_test/send_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // This will come from your state
          output: questionsData.feedback, // Replace with your actual output data
          question: questionsData.question, // Replace with the question data
          student_answer: cleanedStudentCode.current, // Replace with student's answer
          student_name: studentName, // Replace with student's name
        }),
      });

      if (response.ok) {
        setIsLoading(false);
        alert("Progress shared successfully!");
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email. Please try again later.");
    }
  };
  const handleShare = (index) => {
    const currentUrl = window.location.href; // Get current page URL
    const questionLink = `${currentUrl}?question=${index + 1}`; // Create a URL with the question index
    navigator.clipboard.writeText(questionLink); // Copy the link to clipboard

    // Show a toast notification
    alert("Link copied! Share it with your students for instant practice and feedback");
  };

  useEffect(() => {
    // Scroll to top when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this runs only on mount
  useEffect(() => {
    if (questions[0].feedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [questions[0].feedback]);
  return (
    <div>
      <header className="app-header">
        <h1 style={{ marginBottom: "-30px", textAlign: "center", fontFamily: "Arial, sans-serif", fontSize: "32px" }}>OCR P2 Coding Practice Tool</h1>
      </header>
      <h4 className="text-center" style={{ marginBottom: "36px" }}>
        Practise OCR Paper 2 coding questions with instant AI marking and feedback.
      </h4>
      {questionId === null && (
        <p className="text-center" style={{ fontSize: "larger" }}>
          👉 Select a question, then click <b>"Share with Students"</b> to copy the link. Paste it into your preferred platform to share with your
          class.
        </p>
      )}
      <main className="app-main container">
        {/* Student Name input field */}
        <div
          className="d-flex justify-content-start align-items-center mb-5"
          style={{ paddingBottom: "4px", display: questionId === null ? "none" : "" }}
        >
          <h4 className="mb-0 me-3" style={{ fontSize: "18px", fontWeight: "bold", display: questionId === null ? "none" : "" }}>
            Student Name<span style={{ color: "red" }}>*</span>:
          </h4>
          <input
            type="text"
            className="form-control"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Type your name here"
            style={{
              maxWidth: "350px",
              border: "1px solid #1F7DBB",
              borderRadius: "8px",
              padding: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              display: questionId === null ? "none" : "",
            }}
          />
        </div>

        {questions.map((questionData, index) => (
          <div
            key={questionData.id}
            className={`question-section ${questionId === null ? " mb-6" : ""}`}
            style={{ marginBottom: questionId === null ? "80px" : "" }}
          >
            {/* Display each question */}
            <button
              className="submit-button"
              onClick={() => handleShare(index)}
              style={{
                marginLeft: "8px",
                marginTop: "-10px",
                float: "right",
                backgroundColor: "white",
                color: "blueviolet",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "1px solid blueviolet",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                display: questionId ? "none" : "",
              }}
            >
              <img src={shareIcon} alt="" /> Share with Students
            </button>
            <QuestionDisplay questionText={questionData.question} index={index} />

            {/* Code editor section */}
            <section className="code-section" style={{ display: questionId ? "" : "none" }}>
              <h2 style={{ marginBottom: "12px", fontSize: "1.5rem" }}>Your Solution</h2>
              <CodeEditor initialCode={questionData.code} onCodeChange={(newCode) => handleCodeChange(index, newCode)} />
              <div className="submit-container">
                <div className="d-flex align-items-center">
                  <button
                    onClick={() => handleSubmit(index)}
                    style={{ marginTop: "8px", marginBottom: "8px" }}
                    className={`submit-button ${!questionData.isEdited || questionData.isLoading ? "disabled" : ""}`}
                    disabled={!questionData.isEdited || questionData.isLoading}
                  >
                    <span className="button-text">{questionData.isLoading ? "Waiting for AI response..." : "Submit Solution"}</span>
                    {!questionData.isLoading && <span className="button-icon">→</span>}
                  </button>
                </div>

                <span className="submit-note">Note: AI evaluation may take up to 1 minute.</span>
              </div>
            </section>

            {/* Feedback display section */}
            {questionData.feedback && (
              <section className="feedback-section" ref={feedbackRef}>
                <h2>Feedback</h2>
                <FeedbackDisplay
                  feedback={questionData.feedback}
                  calculatedTotalMark={questionData.feedback.calculatedTotalMark}
                  finalTotalMark={questionData.feedback.totalMark}
                />
              </section>
            )}
            {questionData.feedback && (
              <div style={{ marginTop: "60px" }}>
                <p className="text-center" style={{ fontSize: "larger" }}>
                  <b>Would you like to share your progress with your teacher? Type their email below.</b>
                </p>
                <div className="d-flex justify-content-center align-items-center mb-4" style={{ paddingBottom: "10px" }}>
                  <input
                    type="email"
                    className="form-control me-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter teacher's email address"
                    style={{
                      maxWidth: "350px",
                      border: "1px solid #1F7DBB",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      display: !questionId ? "none" : "",
                    }}
                  />
                  <button
                    className={`d-flex submit-button ${isLoading && "disabled"}  `}
                    style={{ padding: "10px 20px", display: !questionId ? "none" : "" }}
                    onClick={() => sendEmail(email, questionData)} // Implement the sendEmail function to handle the click
                    disabled={isLoading}
                  >
                    <span style={{ marginRight: isLoading && "12px" }}>Share Progress</span>
                    {isLoading && (
                      <div class="spinner-border text-dark " role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add this new div for the powered by text */}
        <div className="powered-by">
          Powered by{" "}
          <a href="https://teepee.ai" target="_blank" rel="noopener noreferrer">
            Teepee.ai
          </a>
        </div>
      </main>
    </div>
  );
};

export default QuestionPages;
