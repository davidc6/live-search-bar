# Live search bar

This project is currently being developed.

## Documentation

To run the application type `npm start` when in the project folder. Open a browser and type [http://localhost:3000/](http://localhost:3000/)

## Notes

- No need to store all employees' data in state
- We require only managers' data
- Managers are filtered by 'Job Title' field
- State is managed locally by `useState` and `useEffect` hooks

## Todo

- Break Dropdown component down into smaller components and compose Dropdown components out of the smaller components
- Improve / add accessibility
- Add tests
- Extract common logic into utilities
- Server side-rendering? Should the app support SSR
- Adding redux will allow us to control the state of the whole application (since this component is only a small portion of the application)
- Stub json / improve API response structure (current structure is not very easy to work with on the front end)
- Think about search time complexity (if we have thousands of managers in the list current (`filter` + `includes`) approach might be slow so we need a data structure that enable us to store lots of data and allow to easily search it (for example, a trie / suffix tree)
- Clean up the logic
