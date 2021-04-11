interface CardProps {
  title: string
  description?: string
  color: string
}

const Card = ({ title, description, color }: CardProps) => {
  if(description.length > 1) {
    return (
      <>
        <div style={{ background: `${color}` }} className="big-card">
          <div className="card-top">
            {title}
          </div>
  
          <div className="card-content">
            {description}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div style={{ background: `${color}` }} className="card">
        {title}
      </div>
    </>
  )
}

export { Card }