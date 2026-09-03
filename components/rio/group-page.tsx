'use client';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GroupDialog } from './public-home';
export function GroupPageAction(){const [open,setOpen]=useState(false);return <><Button className="mt-8 h-12 rounded-full px-6" onClick={()=>setOpen(true)}>Registrar un grupo nuevo <ArrowRight/></Button><GroupDialog open={open} onClose={()=>setOpen(false)}/></>}
