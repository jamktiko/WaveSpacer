import { trigger, transition, style, animate } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('160ms ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('160ms ease-in', style({ opacity: 0 }))
  ])
]);

export const doneFade = trigger('doneFade', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.92)' }),
    animate('180ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('180ms ease-in', style({ opacity: 0, transform: 'scale(0.96)' }))
  ])
]);







