import React from 'react';
import { DropdownMenuTrigger } from './src/components/ui/dropdown-menu';
import { Button } from './src/components/ui/button';

export const Test = () => (
  <DropdownMenuTrigger render={<Button variant="ghost" />}>
    Hello
  </DropdownMenuTrigger>
);
