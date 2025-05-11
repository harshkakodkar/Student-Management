import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

mock.onGet("/students").reply(200, [
  { id: 1, name: "John Doe", email: "john@example.com", course: "Math" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", course: "Science" }
]);
