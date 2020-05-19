const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

const Movies = require("../models/movie");
const Directors = require("../models/director");

/*
// All IDs set automatically by mLab
// Don't forget to update after creation
const directorsJson = [
  { "name": "Quentin Tarantino", "age": 55 }, // 5ec03355bd04d04e300ff021
  { "name": "Michael Radford", "age": 72 }, // 5ec12fa572b07cb58afd636e
  { "name": "James McTeigue", "age": 51 }, // 5ec1314b72b07cb58afd636f
  { "name": "Guy Ritchie", "age": 50 }, // 5ec131ca72b07cb58afd6370
];
// directorId - it is ID from the directors collection
const moviesJson = [
  { "name": "Pulp Fiction", "genre": "Crime", "directorId": "5ec03355bd04d04e300ff021" },
  { "name": "1984", "genre": "Sci-Fi", "directorId": "5ec12fa572b07cb58afd636e" },
  { "name": "V for vendetta", "genre": "Sci-Fi-Triller", "directorId": "5ec1314b72b07cb58afd636f" },
  { "name": "Snatch", "genre": "Crime-Comedy", "directorId": "5ec131ca72b07cb58afd6370" },
  { "name": "Reservoir Dogs", "genre": "Crime", "directorId": "5ec03355bd04d04e300ff021" },
  { "name": "The Hateful Eight", "genre": "Crime", "directorId": "5ec03355bd04d04e300ff021" },
  { "name": "Inglourious Basterds", "genre": "Crime", "directorId": "5ec03355bd04d04e300ff021" },
  { "name": "Lock, Stock and Two Smoking Barrels", "genre": "Crime-Comedy", "directorId": "5ec131ca72b07cb58afd6370" },
];

*/

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    watched: { type: new GraphQLNonNull(GraphQLBoolean) },
    rate: { type: GraphQLInt },
    director: {
      type: DirectorType,
      resolve({ directorId }, args) {
        return Directors.findById(directorId);
      },
    },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve({ id }, args) {
        return Movies.find({ directorId: id });
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, { name, age }) {
        const director = new Directors({
          name,
          age,
        });
        return director.save();
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt },
      },
      resolve(parent, { name, genre, directorId, watched, rate }) {
        const movie = new Movies({
          name,
          genre,
          directorId,
          watched,
          rate,
        });
        return movie.save();
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Directors.findByIdAndRemove(id);
      },
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Movies.findByIdAndRemove(id);
      },
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, { id, name, age }) {
        return Directors.findByIdAndUpdate(
          id,
          { $set: { name, age } },
          { new: true }
        );
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt },
      },
      resolve(parent, { id, name, genre, directorId, watched, rate }) {
        return Movies.findByIdAndUpdate(
          id,
          { $set: { name, genre, directorId, watched, rate } },
          { new: true }
        );
      },
    },
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Movies.findById(id);
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Directors.findById(id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve() {
        return Movies.find({});
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve() {
        return Directors.find({});
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
