import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe("pk_test_51Lqb5tKLRGiGTeMX3oOsM1yp3PqPLgQxputgU6qZafrGpoZEF2ppfo3H48yfImMraZsauEBP47DG5kMeW2ZqPDao00VO38lIUF");
  }
  return stripePromise;
};

export default getStripe;