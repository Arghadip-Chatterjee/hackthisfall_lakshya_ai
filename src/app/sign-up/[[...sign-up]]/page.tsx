import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return <div className='flex items-center justify-center text-center m-auto min-h-screen'>
        <SignUp />
    </div>
}