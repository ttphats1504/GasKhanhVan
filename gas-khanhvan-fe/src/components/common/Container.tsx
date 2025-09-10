import {ReactNode} from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
}

const Container = ({children, className}: ContainerProps) => {
  return (
    <div style={{padding: '0 5%'}} className={className}>
      {children}
    </div>
  )
}

export default Container
