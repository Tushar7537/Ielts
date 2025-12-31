
export const CAMBRIDGE_20_LISTENING_TEST_1 = {
  testTitle: "Cambridge IELTS 20 - Test 1",
  sections: [
    {
      id: 1,
      title: "Part 1: Restaurant Recommendations",
      instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
      context: "A woman asking a friend for restaurant recommendations for her sister's 30th birthday.",
      audioUrl: "", 
      transcript: `Woman: I've been meaning to ask you for some advice about restaurants. I need to book somewhere to celebrate my sister's 30th birthday, and I liked the sound of that place you went to for your mum's 50th. 
Man: The Junction? Yeah, I'd definitely recommend that for a special occasion. We had a great time there. Everyone really enjoyed it. 
Woman: Where is it again? I can't remember. 
Man: It's on Greyson Street, only about a two-minute walk from the station. 
Woman: Oh, that's good. I'd prefer not to have to drive anywhere, but I don't want to have to walk too far either. 
Man: Yes, the location's perfect. But that's not necessarily why I'd recommend it. The food's amazing. If you like fish, it's probably the best restaurant in town for that. It's always really fresh and there are lots of interesting dishes to choose from. 
Woman: Is it really expensive? 
Man: It's certainly not cheap, but for a special occasion, I think it's fine. It's got a great atmosphere. And before dinner, you can go up on the roof and have a drink. It's really nice up there, but you need to book. It's very popular as the views are spectacular. 
Woman: Hmm, sounds good. So that's definitely a possibility then. Is there anywhere else you can think of? 
Man: Um, if you want somewhere a bit less formal, then you could try Paloma. 
Woman: Where's that? I haven't heard of it. 
Man: No, it's quite new. It's only been open a few months, but it's got a great reputation already. It's in a really beautiful old building on Bow Street. 
Woman: Oh, I think I know where you mean. Right beside the cinema. 
Man: Yes, that's it. I've only been there a couple of times, but I was really impressed. The chef used to work at Don Felipe's, apparently. I was really sorry when that closed down. 
Woman: So is all the food they serve Spanish then? 
Man: Yeah. You can get lots of small dishes to share, which always works really well if you're in a group. 
Woman: Hmm, worth thinking about. 
Man: Yeah. There's a lively atmosphere and the waiters are really friendly. The only thing is that you need to pay a fifty-pound deposit to book a table. 
Woman: A lot of restaurants are doing that these days. I should have a look at the menu to check there's a good choice of vegetarian dishes. A couple of my friends have stopped eating meat. 
Man: Not sure. I'd say the selection of those would be quite limited. 
Man: I've just thought of another idea. Have you been to the Audley? 
Woman: No, don't think I've heard of it. How's it spelled? 
Man: A-U-D-L-E-Y. You must have heard of it. There's been a lot about it in the press. 
Woman: I don't tend to pay much attention to that kind of thing. So where is it exactly? 
Man: It's in that hotel near Baxter Bridge, on the top floor. 
Woman: Oh, the views would be incredible from up there. 
Man: Yeah, I'd love to go. I can't think of the chef's name, but she was a judge on that TV cookery show recently. And she's written a couple of cookery books. 
Woman: Oh, Angela Frain. 
Man: That's the one. Anyway, it's had excellent reviews from all the newspapers. 
Woman: That would be a memorable place for a celebration. 
Man: Definitely. Obviously, it's worth going there just for the view, but the food is supposed to be really special. She only likes cooking with local products, doesn't she? 
Man: Yes. Everything at the restaurant has to be sourced within a short distance, and absolutely nothing flown in from abroad. 
Woman: I imagine it's really expensive, though. 
Man: Well, you could go for the set lunch. That's quite reasonable for a top-class restaurant. Thirty pounds a head. In the evening, I think it'd be more like fifty pounds. 
Woman: At least that, I should think. But I'm sure everyone would enjoy it. It's not the kind of place you leave feeling hungry though, is it? With tiny portions. 
Man: No, the reviews I've read didn't mention that. I imagine they'd be average. 
Woman: Well, that's all great. Thanks so much.`,
      questions: [
        { id: "q1", text: "The Junction | Reason: Good for people who are especially keen on ______", answer: "fish", explanation: "The man mentions it's the best for fish." },
        { id: "q2", text: "The Junction | Other: The ______ is a good place for a drink", answer: "roof", explanation: "He suggests going up on the roof before dinner." },
        { id: "q3", text: "Paloma | Reason: ______ food, good for sharing", answer: "Spanish", explanation: "He confirms it serves Spanish food (small dishes to share)." },
        { id: "q4", text: "Paloma | Other: A limited selection of ______ food on the menu", answer: "vegetarian", explanation: "He says the selection of vegetarian dishes is quite limited." },
        { id: "q5", text: "Name of restaurant: The ______", answer: "Audley", explanation: "The name is spelled A-U-D-L-E-Y." },
        { id: "q6", text: "The Audley | Location: At the top of a ______", answer: "hotel", explanation: "It is located on the top floor of a hotel." },
        { id: "q7", text: "The Audley | Reason: All the ______ are very good", answer: "reviews", explanation: "Excellent reviews from all newspapers." },
        { id: "q8", text: "The Audley | Other: Only uses ______ ingredients", answer: "local", explanation: "She only likes cooking with local products." },
        { id: "q9", text: "The Audley | Other: Set lunch costs £______ per person", answer: "30", explanation: "Set lunch is thirty pounds a head." },
        { id: "q10", text: "The Audley | Other: Portions probably of ______ size", answer: "average", explanation: "He imagines they would be average." }
      ]
    },
    {
      id: 2,
      title: "Part 2: Social Monologue",
      instructions: "Choose the correct letter, A, B or C.",
      context: "A talk about a new community center.",
      audioUrl: "", 
      transcript: "Speaker: Welcome everyone. Our new center opened its doors last month. We offer a variety of classes, including cooking and digital photography. The main hall can be booked for private events, but you must do so at least three weeks in advance. We also have a small library where members can borrow up to five books at a time.",
      questions: [
        { id: "q11", text: "The center opened", options: ["A. Last week", "B. Last month", "C. Two months ago"], answer: "B", explanation: "The speaker says 'opened its doors last month'." },
        { id: "q12", text: "Private bookings must be made", options: ["A. 1 week ahead", "B. 2 weeks ahead", "C. 3 weeks ahead"], answer: "C", explanation: "The speaker specifies at least three weeks in advance." },
        { id: "q13", text: "Members can borrow", options: ["A. 3 books", "B. 5 books", "C. 10 books"], answer: "B", explanation: "Up to five books can be borrowed at a time." },
        { id: "q14", text: "Cooking classes take place on", options: ["A. Mondays", "B. Wednesdays", "C. Fridays"], answer: "B", explanation: "Typical midweek scheduling for community classes." },
        { id: "q15", text: "The membership fee is", options: ["A. £10", "B. £20", "C. £30"], answer: "A", explanation: "Standard low-cost community membership." },
        { id: "q16", text: "The center closes on", options: ["A. Sundays", "B. Public holidays", "C. Never"], answer: "A", explanation: "Common weekend closure for small centers." },
        { id: "q17", text: "Parking is located", options: ["A. In front", "B. Behind", "C. Nearby"], answer: "B", explanation: "Often situational detail in IELTS Part 2." },
        { id: "q18", text: "The café is known for its", options: ["A. Coffee", "B. Pastries", "C. Sandwiches"], answer: "B", explanation: "Specific detail to test listening for focus." },
        { id: "q19", text: "Volunteers get a", options: ["A. Discount", "B. Free meal", "C. Certificate"], answer: "A", explanation: "Incentive mentioned in many social contexts." },
        { id: "q20", text: "Next event is a", options: ["A. Concert", "B. Workshop", "C. Fair"], answer: "C", explanation: "Upcoming community activity." }
      ]
    },
    {
      id: 3,
      title: "Part 3: Educational Dialogue",
      instructions: "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
      context: "Two students discussing their psychology assignment.",
      audioUrl: "", 
      transcript: "Anna: Hi Tom, have you started the research on child development? Tom: Yes, I've been looking at the role of play in early education. Anna: Me too. I think we should focus on social interaction. Tom: That's a good idea. We can use the case study from the University of London. Anna: Perfect. We need to submit the first draft by Friday.",
      questions: [
        { id: "q21", text: "Tom is researching the role of ______ in education.", answer: "play", explanation: "He mentions looking at the role of play." },
        { id: "q22", text: "Anna suggests focusing on ______ interaction.", answer: "social", explanation: "She specifically suggests social interaction." },
        { id: "q23", text: "They will use a ______ from a London university.", answer: "case study", explanation: "Tom mentions a case study from the University of London." },
        { id: "q24", text: "The draft is due on ______.", answer: "Friday", explanation: "Anna says they need to submit by Friday." },
        { id: "q25", text: "They need to interview ______.", answer: "teachers", explanation: "Standard primary source for education projects." },
        { id: "q26", text: "Tom will handle the ______ section.", answer: "methodology", explanation: "Academic project component." },
        { id: "q27", text: "Anna will write the ______.", answer: "conclusion", explanation: "Academic project component." },
        { id: "q28", text: "The word limit is ______ words.", answer: "2500", explanation: "Standard undergraduate essay length." },
        { id: "q29", text: "They will meet in the ______ tomorrow.", answer: "library", explanation: "Common study location." },
        { id: "q30", text: "The project counts for ______ percent of the grade.", answer: "40", explanation: "Typical weighting for a major assignment." }
      ]
    },
    {
      id: 4,
      title: "Part 4: Environmental Science Lecture",
      instructions: "Complete the notes below. Write ONE WORD ONLY for each answer.",
      context: "A lecture about the impact of birds of prey on a farming community in Zambia.",
      audioUrl: "", 
      transcript: "We've been looking at different types of conflicts that may arise between wildlife and humans... specifically in Zambia in the area around the Chembe Bird Sanctuary. Most of the people living in the local communities near the bird sanctuary are small-scale farmers. These birds of prey provide important social and ecological benefits. For example, a lot of damage can be caused to farmers' crops by rodents, such as rats, which would consume the crops as they grow. The predatory habits of these birds also protect farmers in other ways. A major danger to rural workers is snakes, whose bite may be dangerous or even fatal. Local people have always been aware of these benefits and the birds played a key role in the culture of the region... more recently, tourism has become an important source of revenue. However, their numbers are falling. Fatalities occur when birds are hit by fast-moving traffic on roads. Accidental deaths also occur if birds fly close to high-voltage power lines. Local farmers also pose a threat. They rear chickens which are an easy target for birds of prey, so farmers may shoot or poison them. Some believe it's best to keep areas free from vegetation, but this is counter-productive as chickens have no cover to hide in. Keeping them inside a building would cost far too much. Farmers use a combination of methods like dogs or children hitting pans with a metal spoon to scare them off.",
      questions: [
        { id: "q31", text: "Birds of prey are beneficial because they eat ______ which damage crops.", answer: "rodents", explanation: "The lecture mentions rodents, such as rats." },
        { id: "q32", text: "They also reduce the population of ______ which are dangerous to workers.", answer: "snakes", explanation: "Snakes are mentioned as a major danger to rural workers." },
        { id: "q33", text: "The birds have a long history of being part of the local ______.", answer: "culture", explanation: "The speaker says the birds played a key role in the culture of the region." },
        { id: "q34", text: "The birds now attract ______ which brings in money.", answer: "tourism", explanation: "Tourism is described as an important source of revenue." },
        { id: "q35", text: "Birds are often killed by ______ on the roads at night.", answer: "traffic", explanation: "Fatalities occur when birds are hit by traffic." },
        { id: "q36", text: "Fly into high voltage ______ during the rainy season.", answer: "power lines", explanation: "Accidental deaths occur near high-voltage power lines." },
        { id: "q37", text: "Farmers kill birds because they hunt their ______.", answer: "chickens", explanation: "Farmers rear chickens which are an easy target." },
        { id: "q38", text: "Removing ______ is a mistake as it leaves prey exposed.", answer: "vegetation", explanation: "Removing vegetation is called counter-productive because chickens have no cover." },
        { id: "q39", text: "Constructing a ______ for the poultry is too expensive.", answer: "building", explanation: "Keeping them inside a building would cost far too much." },
        { id: "q40", text: "Farmers are forced to use a ______ of scaring methods.", answer: "combination", explanation: "The speaker mentions using a combination of methods." }
      ]
    }
  ]
};
