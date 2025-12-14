
import React from 'react';
import { LandingPage as LandingPageComponent } from '../components/LandingPage';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return <LandingPageComponent onStart={onStart} />;
};
