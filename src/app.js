const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repositoty = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositoty);

  return response.json(repositoty);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;
  const repositoty = { id, title, url, techs };
  const repositotyIndex = repositories.findIndex(
    (repositoty) => repositoty.id === id
  );

  if (likes) {
    return response.status(400).json({ likes: 0 });
  }

  if (repositotyIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories[repositotyIndex] = repositoty;

  return response.json(repositoty);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositotyIndex = repositories.findIndex(
    (repositoty) => repositoty.id === id
  );

  if (repositotyIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repositotyIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositotyIndex = repositories.findIndex(
    (repositoty) => repositoty.id === id
  );

  if (repositotyIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories[repositotyIndex] = {
    ...repositories[repositotyIndex],
    likes: repositories[repositotyIndex].likes + 1,
  };

  return response.json({ likes: repositories[repositotyIndex].likes });
});

module.exports = app;
