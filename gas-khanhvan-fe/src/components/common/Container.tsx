import {ReactNode} from 'react'

type ContainerProps = {
  children: ReactNode
}

const Container = ({children}: ContainerProps) => {
  return <div style={{padding: '0 5%'}}>{children}</div>
}

export default Container
