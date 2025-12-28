
import React from 'react';
import { HeadshotStyle } from './types';

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate-grey',
    label: 'Corporate Grey',
    description: 'Clean, professional grey studio backdrop.',
    prompt: 'Transform this person into a professional corporate headshot. They should be wearing high-quality professional attire like a suit or a blazer. The background should be a solid, slightly textured neutral grey studio backdrop with professional lighting.',
    previewUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'modern-tech',
    label: 'Modern Tech Office',
    description: 'Bright, airy startup environment.',
    prompt: 'Transform this person into a professional headshot suitable for a tech company. They should be wearing smart-casual professional attire. The background should be a modern, bright office with soft out-of-focus plants and clean architecture.',
    previewUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'outdoor-natural',
    label: 'Outdoor Natural',
    description: 'Warm, organic lighting in a park setting.',
    prompt: 'Transform this person into a high-end professional headshot with natural light. They should be wearing stylish but professional clothing. The background should be a beautiful, softly blurred outdoor park or botanical garden during golden hour.',
    previewUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'executive-dark',
    label: 'Executive Dark',
    description: 'Moody, sophisticated boardroom style.',
    prompt: 'Transform this person into a premium executive headshot. They should be wearing a dark, elegant suit or dress. The background should be a sophisticated, dimly lit executive office or boardroom with soft rim lighting.',
    previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

export const APP_NAME = "PersonaAI";
