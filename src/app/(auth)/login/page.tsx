import { login } from './actions'
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <form>
    
      
      {/* <button formAction={signup}>Sign up</button> */}
      <Button formAction={login} variant="outline">Login Button</Button>
    </form>
  )
}