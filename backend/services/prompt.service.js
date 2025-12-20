import { invokeText, SYSTEM_PROMPTS } from "./groq.service.js";

/**
 * Generate learning material based on topic and level
 */
export async function generateLearningMaterial({ title, topic, level }) {
    const userInstruction = `Generate comprehensive learning material in README-style markdown format.

Topic: ${topic}
Title: ${title || topic || "Learning Notes"}
Level: ${level || "beginner"}

CRITICAL: Follow the EXACT structure below. Output must be properly formatted markdown.

REQUIRED STRUCTURE - COPY THIS FORMAT EXACTLY:

# [Title Here]

[Introduction paragraph: 2-3 sentences explaining what ${topic} is and why it's important. Write in paragraph form with complete sentences.]

## Theory

[Opening paragraph: 2-3 sentences introducing the theoretical foundation of ${topic}. Use proper grammar and full sentences.]

### Core Concepts

[Paragraph: 2-3 sentences explaining the key concepts. Then list them as bullets:]

- **Concept Name 1**: Brief explanation in sentence form
- **Concept Name 2**: Brief explanation in sentence form
- **Concept Name 3**: Brief explanation in sentence form

### Detailed Explanation

[Write 2-3 paragraphs here, each 3-5 sentences long. Explain the concepts in detail using proper paragraph form. Use complete sentences, proper grammar, and clear explanations. Include blank lines between paragraphs.]

[Second paragraph continues the explanation...]

[Third paragraph if needed...]

## Code

\`\`\`[appropriate language]
[Provide a complete, working code example related to ${topic}. Code should be well-formatted, properly indented, and demonstrate the concepts discussed in the theory section.]
\`\`\`

## Code Explanation

[Opening paragraph: 2-3 sentences explaining what the code does overall.]

[Then explain step-by-step using ONE of these formats:]

**Option 1 - Numbered List:**
1. **Step 1 Name**: [2-3 sentence explanation in paragraph form]
2. **Step 2 Name**: [2-3 sentence explanation in paragraph form]
3. **Step 3 Name**: [2-3 sentence explanation in paragraph form]

**Option 2 - Paragraphs:**
[First paragraph: 3-4 sentences explaining the first part of the code]

[Second paragraph: 3-4 sentences explaining the second part of the code]

[Continue as needed...]

## Examples / Exercises

### Example 1: [Example Name]

[Paragraph: 2-3 sentences describing the example]

\`\`\`[language]
[Example code]
\`\`\`

[Paragraph: 2-3 sentences explaining what the example demonstrates]

### Exercise

[Paragraph: 2-3 sentences describing the exercise]

- **Task 1**: [Description in sentence form]
- **Task 2**: [Description in sentence form]
- **Task 3**: [Description in sentence form]

## Summary / Key Takeaways

[Paragraph: 3-4 sentences summarizing the main points learned about ${topic}]

**Key Points:**
- [Main takeaway 1]
- [Main takeaway 2]
- [Main takeaway 3]

FORMATTING CHECKLIST:
✓ Use # for main title (single hash)
✓ Use ## for major sections (double hash)
✓ Use ### for subsections (triple hash)
✓ Include TWO blank lines between major sections
✓ Include ONE blank line between subsections
✓ Use proper code blocks with language tags
✓ Write theory in paragraph form, not bullets
✓ Use double line breaks between paragraphs
✓ Use **bold** for important terms
✓ Use \`inline code\` for technical terms
✓ Ensure all sections are properly spaced

Generate the content following this EXACT structure and formatting.`;

    return await invokeText(SYSTEM_PROMPTS.learn, userInstruction);
}

/**
 * Generate code explanation
 */
export async function generateCodeExplanation({ code, language }) {
    const userInstruction = `Explain the following ${language} code in detail using README-style markdown format.

CODE TO EXPLAIN:
\`\`\`${language}
${code}
\`\`\`

REQUIREMENTS:
- Start with a main heading (# Code Explanation)
- Include an overview paragraph explaining what the code does
- Use ## for major sections (e.g., ## Code Overview, ## Step-by-Step Breakdown)
- Use ### for subsections (e.g., ### Function Analysis, ### Variable Explanation)
- Break down the code step-by-step with numbered lists or subsections
- Include code snippets with proper formatting and language tags
- Add inline code references: \`functionName()\`, \`variableName\`
- Use bold text for important concepts: **concept**
- Include time/space complexity analysis if relevant
- List common pitfalls or gotchas
- Add usage examples in code blocks
- Use proper spacing between all sections (blank lines)
- Format paragraphs with double line breaks
- End with a summary section

Provide a clear, well-formatted explanation that's easy to understand and follow.`;

    return await invokeText(SYSTEM_PROMPTS.explain, userInstruction);
}

/**
 * Generate code review
 */
export async function generateCodeReview({ code, language, context }) {
    const userInstruction = `Review the following ${language} code and provide feedback in README-style markdown format.

CODE TO REVIEW:
\`\`\`${language}
${code}
\`\`\`

${context ? `Context: ${context}\n` : ""}
REQUIREMENTS:
- Start with a main heading (# Code Review)
- Include a brief overview/summary paragraph
- Use ## for major sections (e.g., ## Critical Issues, ## Code Quality, ## Security)
- Use ### for subsections within major sections
- Categorize issues by severity: **Critical**, **High**, **Medium**, **Low**
- Use bullet points for lists of issues or recommendations
- Include code snippets showing problems and suggested fixes
- Use inline code for code references: \`functionName()\`
- Use blockquotes for important notes: > Important note
- Format code examples in proper code blocks with language tags
- Use proper spacing between all sections (blank lines)
- Format paragraphs with double line breaks
- Include sections for:
  * Critical Issues (if any)
  * Code Quality Issues
  * Security Concerns
  * Performance Optimizations
  * Best Practices Recommendations
  * Test Recommendations
  * Edge Cases
  * Summary

Provide a professional, well-formatted code review that's actionable and easy to follow.`;

    return await invokeText(SYSTEM_PROMPTS.review, userInstruction);
}

/**
 * Generate learning roadmap
 */
export async function generateRoadmap({ goal, currentSkills, timeframe }) {
    const userInstruction = `Create a comprehensive learning roadmap in README-style markdown format.

Goal: ${goal}
Current Skills: ${currentSkills || "Not specified"}
Timeframe: ${timeframe || "Flexible"}

REQUIREMENTS:
- Start with a main heading (# Learning Roadmap: [Goal])
- Include an overview paragraph describing the learning path
- **MANDATORY: Create a visual ASCII diagram** showing the learning path flow (see ASCII diagram requirements below)
- Use ## for major phases or milestones (e.g., ## Phase 1: Foundations)
- Use ### for subsections within phases (e.g., ### Objectives, ### Resources, ### Tasks)
- Use bullet points for resources, tasks, and goals
- Use numbered lists for sequential steps
- Use checkboxes for tasks: - [ ] Task name
- Use bold text for timeframes: **Week 1-2**, **Month 1**
- Use inline code for technologies: \`technology\`
- Include code examples or commands in code blocks when relevant
- Add horizontal rules (---) to separate major phases
- Use proper spacing between all sections (blank lines)
- Format paragraphs with double line breaks
- Include sections for:
  * Prerequisites
  * ASCII Diagram (visual learning path)
  * Phase 1, 2, 3... (each with objectives, resources, tasks, timeline)
  * Practice Projects
  * Measurable Goals
  * Timeline Summary
  * Next Steps

ASCII DIAGRAM REQUIREMENTS:
- Create a visual ASCII art diagram that shows the complete learning journey
- Use box-drawing characters for better visuals:
  * Box corners: ┌ ┐ └ ┘
  * Lines: │ (vertical) ═ (horizontal) ├ ┤ ┬ ┴ ┼
  * Double lines: ║ ═ ╔ ╗ ╚ ╝
- Or use simple characters: + - | for boxes
- Use arrows to show progression: → ← ↑ ↓ or => or ->
- Show each phase as a box or node with the phase name
- Include duration/timeframe in each phase box (e.g., "Week 1-4")
- Show connections between phases with arrows
- Display prerequisites visually (e.g., at the top or left)
- Show milestones or checkpoints along the path
- Make it horizontally or vertically oriented (choose best for the content)
- Place the diagram in a code block: \`\`\`text or \`\`\`ascii
- Position it right after the overview section, before detailed phases
- Example structure:
  \`\`\`text
  Prerequisites
      │
      ▼
  ┌─────────────┐
  │ Phase 1     │
  │ Week 1-4    │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ Phase 2     │
  │ Week 5-8    │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ Phase 3     │
  │ Week 9-12   │
  └─────────────┘
  \`\`\`

- Make the diagram visually appealing, clear, and easy to understand
- Include key milestones or achievements in the diagram if possible

Create a well-structured, actionable roadmap with a clear visual ASCII diagram that's easy to follow and track progress.`;

    return await invokeText(SYSTEM_PROMPTS.roadmap, userInstruction);
}

/**
 * Debug code and find issues
 */
export async function debugCode({ code, language, errorMessage, context }) {
    const systemPrompt = `You are an expert debugging assistant. Analyze code and present findings in README-style markdown format.

FORMATTING REQUIREMENTS:
- Use proper markdown heading hierarchy: # for title, ## for major sections, ### for subsections
- Include clear spacing (blank lines) between sections
- Use code blocks with proper language tags: \`\`\`language
- Format code examples with syntax highlighting
- Use numbered lists for step-by-step processes
- Use bullet points for issues, fixes, or strategies
- Include paragraphs with proper line breaks
- Use bold text for severity: **Critical**, **Warning**
- Use inline code for code references: \`functionName()\`
- Use blockquotes for important notes: > Note text
- Structure with clear sections and visual separation

CONTENT STRUCTURE:
1. Main title (# Debugging Analysis)
2. Overview summary
3. ## Error Identification
4. ## Root Cause Analysis
5. ## Step-by-Step Debugging Approach
6. ## Fixed Code
7. ## Prevention Strategies
8. ## Summary

Ensure professional, well-formatted output that's easy to read and actionable.`;

    const userInstruction = `Debug the following ${language} code and provide analysis in README-style markdown format.

CODE TO DEBUG:
\`\`\`${language}
${code}
\`\`\`

${errorMessage ? `Error Message: ${errorMessage}\n` : ""}
${context ? `Context: ${context}\n` : ""}
REQUIREMENTS:
- Start with a main heading (# Debugging Analysis)
- Include an overview paragraph
- Use ## for major sections (e.g., ## Error Identification, ## Root Cause Analysis)
- Use ### for subsections
- Use numbered lists for step-by-step debugging approach
- Include code snippets showing the buggy code and fixed code
- Use inline code for code references: \`variableName\`
- Use bold text for important points: **key insight**
- Format code examples in proper code blocks with language tags
- Use proper spacing between all sections (blank lines)
- Format paragraphs with double line breaks
- Provide clear explanations for each issue and fix

Provide a thorough, well-formatted debugging analysis.`;

    return await invokeText(systemPrompt, userInstruction);
}

/**
 * Format code according to best practices
 */
export async function formatCode({ code, language, styleGuide }) {
    const systemPrompt = `You are a code formatting expert. Format code and present results in README-style markdown format.

FORMATTING REQUIREMENTS:
- Use proper markdown heading hierarchy: # for title, ## for major sections, ### for subsections
- Include clear spacing (blank lines) between sections
- Use code blocks with proper language tags: \`\`\`language
- Format code examples with syntax highlighting
- Use bullet points for lists of changes or practices
- Include paragraphs with proper line breaks
- Use bold text for important concepts: **concept**
- Use inline code for code references: \`functionName()\`
- Use blockquotes for style guide notes: > Note text
- Structure with clear sections and visual separation

CONTENT STRUCTURE:
1. Main title (# Code Formatting)
2. Overview paragraph
3. ## Formatted Code
4. ## Formatting Changes Explained
5. ## Style Guide Compliance
6. ## Best Practices Applied
7. ## Summary

Ensure professional, well-formatted output that's easy to read and understand.`;

    const userInstruction = `Format the following ${language} code according to ${styleGuide || "standard best practices"} and present results in README-style markdown format.

ORIGINAL CODE:
\`\`\`${language}
${code}
\`\`\`

REQUIREMENTS:
- Start with a main heading (# Code Formatting)
- Include an overview paragraph
- Use ## for major sections (e.g., ## Formatted Code, ## Changes Explained)
- Use ### for subsections
- Show the formatted code in a proper code block with language tag
- List formatting changes with bullet points
- Explain each change clearly
- Use inline code for code references: \`functionName()\`
- Use bold text for important points: **key change**
- Format code examples in proper code blocks
- Use proper spacing between all sections (blank lines)
- Format paragraphs with double line breaks
- Include style guide compliance notes
- List best practices applied

Provide a clear, well-formatted analysis of the code formatting.`;

    return await invokeText(systemPrompt, userInstruction);
}

/**
 * Test API endpoints
 */
export async function testAPI({ endpoint, method, headers, body, expectedResponse }) {
    const systemPrompt = `You are an API testing expert. Analyze API endpoints and present findings in README-style markdown format.

FORMATTING REQUIREMENTS:
- Use proper markdown heading hierarchy: # for title, ## for major sections, ### for subsections
- Include clear spacing (blank lines) between sections
- Use code blocks with proper language tags: \`\`\`language or \`\`\`json
- Format code examples with syntax highlighting
- Use bullet points for lists of issues, test cases, etc.
- Use numbered lists for sequential steps
- Include paragraphs with proper line breaks
- Use bold text for important concepts: **concept**
- Use inline code for code references: \`endpoint\`, \`method\`
- Use blockquotes for important notes: > Note text
- Use tables for comparing test cases if helpful
- Structure with clear sections and visual separation

CONTENT STRUCTURE:
1. Main title (# API Testing Analysis)
2. Overview paragraph
3. ## Request Structure Analysis
4. ## Test Cases
5. ## Potential Issues & Edge Cases
6. ## Expected Responses
7. ## Security Considerations
8. ## Performance Recommendations
9. ## Sample Test Code
10. ## Summary

Ensure professional, well-formatted output that's comprehensive and actionable.`;

    const userInstruction = `Test the following API endpoint and provide comprehensive analysis in README-style markdown format.

API DETAILS:
Endpoint: ${endpoint}
Method: ${method || "GET"}
${headers ? `Headers:\n\`\`\`json\n${JSON.stringify(headers, null, 2)}\n\`\`\`\n` : ""}
${body ? `Body:\n\`\`\`json\n${JSON.stringify(body, null, 2)}\n\`\`\`\n` : ""}
${expectedResponse ? `Expected Response:\n\`\`\`json\n${JSON.stringify(expectedResponse, null, 2)}\n\`\`\`\n` : ""}
REQUIREMENTS:
- Start with a main heading (# API Testing Analysis)
- Include an overview paragraph
- Use ## for major sections (e.g., ## Request Structure, ## Test Cases)
- Use ### for subsections
- Include code examples in proper code blocks with language tags (json, javascript, etc.)
- Use bullet points for lists of issues or test cases
- Use numbered lists for sequential testing steps
- Use inline code for API references: \`/api/endpoint\`
- Use bold text for important points: **critical issue**
- Format JSON examples in proper code blocks
- Use proper spacing between all sections (blank lines)
- Format paragraphs with double line breaks
- Include sample test code in code blocks
- Provide comprehensive testing guidance

Provide thorough, well-formatted API testing analysis.`;

    return await invokeText(systemPrompt, userInstruction);
}

