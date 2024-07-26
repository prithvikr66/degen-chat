import React from 'react';
import { motion } from 'framer-motion';
import bottle from '../assets/bottle.png';  // Update this path to your actual image

const AnimatedBottle: React.FC = () => {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}  // Move up and down by 10 pixels
      transition={{
        duration:0.5,  // Duration of the animation in seconds
        repeat: Infinity,  // Repeat the animation infinitely
        repeatType: 'loop',  // Loop the animation
      }}
    >
      <img src={bottle} className="mx-auto w-[100px] h-auto" alt="bottle" />
    </motion.div>
  );
};

export default AnimatedBottle;
