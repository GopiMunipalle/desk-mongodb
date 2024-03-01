import express from 'express';
import connectDb from './db';
import userRoute from './routes/userRoute';
import otpRouter from './routes/otpRoute';
import productRouter from './routes/productRoute';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRoute);
app.use('/otp', otpRouter);
app.use('/products', productRouter);


connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log('DB not connected', error);
  });

export default app;
