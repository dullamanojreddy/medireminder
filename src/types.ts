export type Language = 'English' | 'Hindi' | 'Telugu' | 'Tamil' | 'Kannada' | 'Marathi';

export interface ToastMessage {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  message: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: string;
}
