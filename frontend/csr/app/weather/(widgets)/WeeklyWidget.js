'use client'
import styles from './(css)/weekly.module.css';
import { useState } from 'react';
import { Dosis } from '@next/font/google';

const font = Dosis({
    subsets: ['latin'],
    weight: ['400']
});

export default function WeeklyWidget({props}) {
  return (
    <div className={styles.wrapper}>
        Weather for ID {props}
    </div>
  );
}