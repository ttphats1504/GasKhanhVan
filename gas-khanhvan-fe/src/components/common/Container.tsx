import {ReactNode} from 'react'

type ContainerProps = {
  children: ReactNode
}

const Container = ({children}: ContainerProps) => {
  return <div style={{padding: '0 48px'}}>{children}</div>
}

export default Container
