# FinTracker

## A Finance Tracking Website

This full-stack website tracks the users' inputted transaction history by letting the user set the budget, and displays any sort of financial reports, such as how much they spent on shopping alone. This project utilizes MySQL by storing user account information from the login page, transactions, and budgets (so far). This project also utilizes HTML, JavaScript, and CSS.

Regarding my database, I am using Node.js (as my backend), which helps me run my main server, ```server.js```. The MySQL database is also stored within this server. I am also currently running this environment using Docker, since it containerizes my application, making it easier to run this program in any enivronment and helps ensure my dependencies, like Node.js and MySQL, are running correctly. In summary, Node.js is used for my backend, while Docker helps to ensure everything runs as it should.

## What I learned

Considering that this is my first fully-stacked website, I would say that this was a very fun experience, considering that I'm no pro in JavaScript or SQL, doing this project hands-on has allowed me to become more proficient. In general, this is the first time that I have used any of these coding languages in this project (HTML, CSS, JavaScript, and Docker), but all these languages seemed surprisingly straightforward compared to languages like C/C++. Now, what I still have to learn from this project, however, is the looks and the aesthetics of the website. Maybe it's just me and my taste, but I feel I could do way better in appearance for the website, although I did keep a consistent theme (or tried to). After completing this project, I perused a lot of JavaScript and React libraries online that have aesthetically pleasing animations. One particular library that I wanted to incorporate (but did not want to due to the risk of complicating my beginner website) is https://motion.dev/.

Overall, the most important aspect of this project that I learned is understanding the function of the frontend and the backend, and simply connecting the two. As long as I understand that, making future websites will become a lot smoother. I have also realized I could have been using the React library as well, but when I started the project, I was not aware of its existence, so for future reference, I will be incorportating React as a frontend library. 

## To Access

If you want to try this website out for yourself, you just need to git clone my repository.

```git clone https://github.com/fawazm30/FinTracker.git``` 

```cd FinTracker```

After that, you will need to enter ```docker-compose up``` into the terminal (or ```docker-compose up -d``` if they want to run it in the background). This ensures that the MySQL database exists, is defined, and is also accessible. Afterwards, your terminal should print out your local host link, for example:

```Server running at http://localhost:3000```

## Final Look

Here's a screen recording of my final look. I did attempt to deploy my website; however, the process for deployment is confusing, and I could not find a solution to this problem, so I thought a screen recording would be good enough, as well as git cloning this repository.

https://drive.google.com/file/d/15j6GSaTfPzDugwhhI0uVUd9hFAuXi6Iz/view?usp=sharing
