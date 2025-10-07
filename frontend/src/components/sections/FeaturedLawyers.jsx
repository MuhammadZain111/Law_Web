import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, MapPin, Star } from "../../assets/icons/Icons.jsx"
import IMAGES from "../../constants/Images.js"
import { api } from "../../shared/api.js"
import Badge from "../common/Badge.jsx"
import Button from "../common/Button.jsx"
import { Card, CardContent } from "../common/Card.jsx"

const FeaturedLawyers = () => {
  const [lawyers, setLawyers] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/lawyers?status=approved')
        const list = (res.data || []).map(l => ({
          id: l._id,
          name: l.fullName || l.name,
          specialization: l.specialization,
          rating: 4.8,
          reviews: 100,
          location: [l.city, l.state, l.country].filter(Boolean).join(', ') || 'N/A',
          image: l.photoUrl || IMAGES.lawyer,
          areas: [],
        }))
        if (list.length) setLawyers(list)
      } catch (_e) {
        // silently ignore; no fallback data
      }
    })()
  }, [])

  return (
   
    <section className="py-16  px-40 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Lawyers</h2>
          <p className="text-gray-600">Top-rated legal professionals ready to help you</p>
        </div>
        <Link to="/lawyers">
          <Button variant="outline" className="mt-4 md:mt-0">
            View All Lawyers
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {lawyers.map((lawyer) => (
          <Card key={lawyer.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={lawyer.image || "/placeholder.svg"}
                alt={lawyer.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-1">{lawyer.name}</h3>
              <p className="text-gray-600 mb-2">{lawyer.specialization}</p>
              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                <span className="font-medium">{lawyer.rating}</span>
                <span className="text-gray-500 text-sm ml-1">({lawyer.reviews} reviews)</span>
              </div>
              <div className="flex items-center text-gray-500 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{lawyer.location}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {lawyer.areas.map((area, index) => (
                  <Badge key={index} className="text-xs bg-white">
                    {area}
                  </Badge>
                ))}
              </div>
              <Link to={`/lawyers/${lawyer.id}`} className="block mt-4">
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>

  )
}

export default FeaturedLawyers
