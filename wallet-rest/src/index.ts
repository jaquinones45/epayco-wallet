import routes from './routes';

const app = routes.server();

// starting server
app.set('PORT', process.env.PORT || 8081);
app.listen(app.get('PORT'), () => {
  console.info(`Server is running on ${Number(app.get('PORT'))}`);
});
