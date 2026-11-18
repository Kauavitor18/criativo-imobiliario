
import React from 'react';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  credits: number;
  features: string[];
  popular?: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  initial: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Segment {
  name: string;
  description: string;
  icon: React.ReactNode;
}