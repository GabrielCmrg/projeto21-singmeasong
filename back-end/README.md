# <p align = "center"> Sing me a song Back-end API</p>

<p align="center">
   <img src="../microphone.svg" alt="microphone" height="200"/>
</p>

## :clipboard: Description

In order to provide features and a database to the front-end of this project, this back-end was created. It manages all the recommendations.

---

## :rocket: Routes

```yml
POST /recommendations
    - Add new song recomendation
    - body: {
        "name": "Falamansa - Xote dos Milagres",
        "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    }
```

```yml
POST /recommendations/:id/upvote
- Increment the recomentation score
- Doesn't need a body
```

```yml
POST /recommendations/:id/downvote
- Decrement the recomentation score
- Doesn't need a body
```

```yml
GET /recommendations
    - List the last 10 recommendations
    - The return is
    - body: [
        {
            "id": 1,
            "name": "Chitãozinho E Xororó - Evidências",
            "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
            "score": 245
        }
    ]
```

```yml
GET /recommendations/:id
    - List a recommendation by id
    - The return is
    - body: {
        "id": 1,
        "name": "Chitãozinho E Xororó - Evidências",
        "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
        "score": 245
    }
```

```yml
GET /recommendations/random
    - List a recommendation randomly
    - 70% of the time the score is above 10
    - 30% of the time the score is between -5 and 10
    - The return is
    - body: {
        "id": 1,
        "name": "Chitãozinho E Xororó - Evidências",
        "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
        "score": 245
    }
```

```yml
GET /recommendations/top/:amount
    - List the top amount recommendations ordened by score
    - The return is
    - body: [
        {
            "id": 150,
            "name": "Chitãozinho E Xororó - Evidências",
            "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
            "score": 245
        },
        {
            "id": 12,
            "name": "Falamansa - Xote dos Milagres",
            "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
            "score": 112
        },
        ...
    ]
```

---

## :test_tube: Running tests

For you to run the tests you will need to run the commands

```
npm run test:unit
```

or

```
npm run test:integration
```

or

```
npm run test:e2e
```

Depending on the test you want to run. The e2e test is just to start the app, you will need to use cypress on front-end to do the actual e2e test.
