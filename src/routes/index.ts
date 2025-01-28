import { Router } from 'express';

const router = Router();

router.use('/', (req, res) => {
  console.log('we were here');
});

export default router;
