# SPA Comments

## API DATA

[API DOCS](https://dzen-task.onrender.com/v1/static)

DataBase: ```MySQL (PlanetScale.com)```

Server: ```render.com``` (need ~2 minutes to wake up if have no action on last 30 minutes)

## APP FUNCTIONALITY

> Form fields
- User Name - one word 3 to 19 symbols (latin or number) length (!required)
- E-mail - custom validation (!required)
- Homepage - input type ulr (optional)
- CAPTCHA - randomly generated in server SVG image with text (!required):
  1. can be refreshed with ```refresh``` button.
- text - textarea with ```[i], [strong], [code], [a]``` buttons to add specific style. if user quoted previous message (reply open clean form, quotes open form with text of previous comment):
  1.  we can select specific text and wrap up selection with tag we need.
  1.  review message with ```preview``` button.

> Comments
- form have a postId to connect comment with some post and reuse component (can be added an api call by postId etc.).
- we can answer comment on any level.
- we can rate comment (one ip one mark).
- comments levels are shown by using corresponding indentations.
- comments are connected by the double side linked list logic.
- to build comments structure was implemented method deep first to left(dftl).
- by default comments will appear by date.

#### NEEDS TO
- add image(logo)/file upload with all checks and additional actions.
- pagination;
- comment sorting;
- refactoring, decomposition of the components to the smaller parts;
- logic splitting in some functions after refactoring;
- move general logic to global storage (context or redux, hook);
