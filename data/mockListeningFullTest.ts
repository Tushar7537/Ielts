
export const MOCK_LISTENING_FULL_TEST = {
  id: "mock-1",
  title: "Official Practice Test 1",
  sections: [
    {
      id: 1,
      title: "Section 1: Social Context",
      instructions: "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
      context: "A conversation between a customer and a clerk at a gym about membership.",
      questions: [
        { id: "q1", text: "Customer Name: Sarah ______", type: "completion", answer: "Thompson" },
        { id: "q2", text: "Membership Type: ______", type: "completion", answer: "Premium" },
        { id: "q3", text: "Monthly Fee: £______", type: "completion", answer: "45" },
        { id: "q4", text: "Start Date: ______ October", type: "completion", answer: "12th" },
        { id: "q5", text: "Preferred Class: ______", type: "completion", answer: "Yoga" },
        { id: "q6", text: "Waitlist for: ______", type: "completion", answer: "Pilates" },
        { id: "q7", text: "Referral from: ______", type: "completion", answer: "Colleague" },
        { id: "q8", text: "Payment Method: ______", type: "completion", answer: "Debit Card" },
        { id: "q9", text: "ID Provided: ______", type: "completion", answer: "Passport" },
        { id: "q10", text: "Lockers included? (Yes/No)", type: "completion", answer: "Yes" }
      ],
      transcript: "Clerk: Good morning, welcome to City Fitness. How can I help you?\nSarah: Hi, I'd like to inquire about a membership. My name is Sarah Thompson.\nClerk: Nice to meet you, Sarah. We have several tiers. Our most popular is the Premium tier.\nSarah: That sounds good. What's the monthly fee for that?\nClerk: It's currently forty-five pounds per month.\nSarah: Great. Can I start on the 12th of October?\nClerk: Certainly. Which classes are you interested in?\nSarah: I love Yoga, but I heard your Pilates classes are full.\nClerk: They are, but I can put you on the waitlist for Pilates.\nSarah: Please do. A colleague told me about this place.\nClerk: Excellent. I'll need a debit card for payment and your passport for ID.\nSarah: Here they are. Are lockers included?\nClerk: Yes, they are part of the Premium package."
    },
    {
      id: 2,
      title: "Section 2: Monologue - Social Context",
      instructions: "Label the map below. Write the correct letter A-H next to questions 11-15.",
      context: "A guide speaking to visitors at the West Hill Nature Reserve.",
      questions: [
        { id: "q11", text: "Visitor Center", type: "choice", options: ["A", "B", "C", "D"], answer: "B" },
        { id: "q12", text: "Picnic Area", type: "choice", options: ["E", "F", "G", "H"], answer: "E" },
        { id: "q13", text: "Bird Hide", type: "choice", options: ["A", "D", "G", "H"], answer: "G" },
        { id: "q14", text: "Main Lake", type: "choice", options: ["C", "F", "A", "B"], answer: "C" },
        { id: "q15", text: "The Old Mill", type: "choice", options: ["H", "G", "F", "E"], answer: "F" },
        { id: "q16", text: "When was the reserve established?", type: "choice", options: ["1970", "1982", "1995"], answer: "1982" },
        { id: "q17", text: "What is the main threat to the birds?", type: "choice", options: ["Pollution", "Predators", "Lack of Food"], answer: "Pollution" },
        { id: "q18", text: "Volunteers are needed for:", type: "choice", options: ["Guided Tours", "Path Maintenance", "Funding"], answer: "Path Maintenance" },
        { id: "q19", text: "The café closes at:", type: "choice", options: ["4:00 PM", "4:30 PM", "5:00 PM"], answer: "4:30 PM" },
        { id: "q20", text: "Dogs must be kept on a lead in:", type: "choice", options: ["The whole park", "Woodland only", "Near the lake"], answer: "The whole park" }
      ],
      transcript: "Guide: Welcome to West Hill! I'll guide you through the map. You are currently at the entrance. The Visitor Center is the large building labeled B on your right. If you want to eat, the Picnic Area is at E, just behind the woods. For those interested in photography, the Bird Hide at G offers the best views of the Main Lake at C. Finally, don't miss the Old Mill at F, a historical landmark from the 1800s. We were established in 1982 to protect local species. Our biggest challenge today isn't predators, but water pollution. We rely on volunteers for path maintenance. The cafe closes at 4:30 PM, and please keep your dogs on a lead everywhere in the reserve."
    },
    {
      id: 3,
      title: "Section 3: Educational Conversation",
      instructions: "What does each student think about the following aspects of their project? Write the correct letter A, B or C (A=Positive, B=Negative, C=Neutral).",
      context: "Three students discussing their university project on Urban Planning.",
      questions: [
        { id: "q21", text: "Data Collection", type: "choice", options: ["A", "B", "C"], answer: "B" },
        { id: "q22", text: "Case Study Choice", type: "choice", options: ["A", "B", "C"], answer: "A" },
        { id: "q23", text: "Group Communication", type: "choice", options: ["A", "B", "C"], answer: "C" },
        { id: "q24", text: "Presentation Software", type: "choice", options: ["A", "B", "C"], answer: "B" },
        { id: "q25", text: "Tutor Feedback", type: "choice", options: ["A", "B", "C"], answer: "A" },
        { id: "q26", text: "Who will write the introduction?", type: "choice", options: ["John", "Anna", "Mark"], answer: "Anna" },
        { id: "q27", text: "When is the final deadline?", type: "choice", options: ["Friday", "Monday", "Wednesday"], answer: "Monday" },
        { id: "q28", text: "How many words is the limit?", type: "choice", options: ["2000", "2500", "3000"], answer: "3000" },
        { id: "q29", text: "The primary focus is on:", type: "choice", options: ["Traffic", "Housing", "Greenery"], answer: "Traffic" },
        { id: "q30", text: "They will meet next at:", type: "choice", options: ["Library", "Cafe", "Online"], answer: "Library" }
      ],
      transcript: "John: Hey Anna, Mark. How's the project going? I found the data collection really frustrating.\nAnna: I agree, it was a mess. But I love our case study choice of Tokyo.\nMark: Tokyo is fine, I guess. I'm neutral on that. Communication has been okay, not great, not bad.\nAnna: The presentation software we're using is so slow though, I hate it.\nJohn: But the tutor feedback was fantastic! Really positive. Anna, can you do the intro?\nAnna: Sure. Let's remember the deadline is Monday, not Friday. 3000 words maximum.\nMark: We need to focus on traffic solutions. Let's meet at the library tomorrow."
    },
    {
      id: 4,
      title: "Section 4: Academic Monologue",
      instructions: "Complete the notes below. Write ONE WORD ONLY for each answer.",
      context: "A lecture on the history of map-making (Cartography).",
      questions: [
        { id: "q31", text: "Early maps were often carved on ______.", type: "completion", answer: "clay" },
        { id: "q32", text: "Ptolemy used a system of ______ to improve accuracy.", type: "completion", answer: "coordinates" },
        { id: "q33", text: "During the Middle Ages, maps were often ______.", type: "completion", answer: "symbolic" },
        { id: "q34", text: "The 'T-O' map placed ______ at the center.", type: "completion", answer: "Jerusalem" },
        { id: "q35", text: "The Age of Discovery required better ______ navigation.", type: "completion", answer: "ocean" },
        { id: "q36", text: "Mercator's projection was vital for ______.", type: "completion", answer: "sailors" },
        { id: "q37", text: "Modern maps rely heavily on ______ technology.", type: "completion", answer: "satellite" },
        { id: "q38", text: "The ______ of a map depends on its purpose.", type: "completion", answer: "scale" },
        { id: "q39", text: "Color is used to represent ______ in topographic maps.", type: "completion", answer: "altitude" },
        { id: "q40", text: "Maps today are increasingly ______ and interactive.", type: "completion", answer: "digital" }
      ],
      transcript: "Lecturer: Good afternoon. Today we'll discuss the history of cartography. The earliest known maps were not on paper but carved on clay tablets. Later, Ptolemy revolutionized the field by introducing coordinates. In the Middle Ages, maps became more symbolic than geographical; for example, T-O maps placed Jerusalem at the very center. As we entered the Age of Discovery, ocean navigation became the priority. Mercator created his famous projection to help sailors maintain a constant course. Today, satellite technology has changed everything. A map's scale depends on its specific use, and altitude is often shown via color. Maps are now digital and fully interactive."
    }
  ]
};
