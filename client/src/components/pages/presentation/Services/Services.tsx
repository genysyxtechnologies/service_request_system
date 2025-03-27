import ServicesTable from "./ServicesTable"

function Services() {
    const handleItemClick = () => {
        console.log('Hello')
      };

  return (
    <ServicesTable  onItemClick={handleItemClick}/>
  )
}

export default Services