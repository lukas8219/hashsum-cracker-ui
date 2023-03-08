import { Inter } from 'next/font/google'
import { Button, OutlinedInput } from '@mui/material';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
      <OutlinedInput color='warning' placeholder='Search hash' />
        <OutlinedInput color='warning' placeholder='Expected Length'/>
        <Button color='warning'>Crack</Button>
      </div>
    </>
  )
}
