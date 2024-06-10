// VehicleDetails.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './VehicleDetails.css';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import SkeletonCard from '../../components/Skeleton/SkeletonCard';

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const response = await fetch(`${import.meta.env.DEV ? import.meta.env.VITE_DEV_API_BASE_URL : import.meta.env.VITE_PROD_API_BASE_URL}/listings/${id}?populate=*`);
        const data = await response.json();
        setVehicle(data.data);
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return <SkeletonCard />; // Show SkeletonCard while loading
  }

  if (!vehicle) {
    return <p>Loading...</p>;
  }

  const { attributes } = vehicle;
  const { Year, Price, Contact, Description, Gallery, model, fuel, gearbox, seller, condition, location } = attributes;

  const constructImageUrl = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${import.meta.env.DEV ? import.meta.env.VITE_DEV_API_IMAGE_URL : import.meta.env.VITE_PROD_API_IMAGE_URL}${url}`;
  };

  const images = (Gallery?.data || []).map((image) => {
    const largeUrl = image.attributes.formats.large?.url;
    const mediumUrl = image.attributes.formats.medium?.url;
    const smallUrl = image.attributes.formats.small?.url;
    const ThumbnailUrl = image.attributes.formats.thumbnail?.url;
    const thumbnailUrl = image.attributes.formats.thumbnail?.url;

    const originalUrl = largeUrl || mediumUrl || smallUrl || ThumbnailUrl;

    if (originalUrl && thumbnailUrl) {
      return {
        original: constructImageUrl(originalUrl),
        thumbnail: constructImageUrl(thumbnailUrl),
      };
    }
    return null;
  }).filter(image => image !== null);

  return (
    <div className="vehicle-details">
      <div className="vehicle-info">
        {images.length > 0 && (
          <ImageGallery items={images} showPlayButton={false} className="image-gallery"/>
        )}
        <div className="description">
          {Year && model && model.data && <h1>{Year} {model.data.attributes.Model}</h1>}
          <div className="info">
            {fuel && fuel.data && (
              <div className='detailed-info'>
                <i className="bi bi-fuel-pump" />
                <p>{fuel.data.attributes.FuelType}</p>
              </div>
            )}
            {gearbox && gearbox.data && (
              <div className='detailed-info'>
                <span className="material-symbols-outlined">auto_transmission</span>
                <p>{gearbox.data.attributes.Transmission}</p>
              </div>
            )}
            {condition && condition.data && (
              <div className='detailed-info'>
                <i className="bi bi-pin-map-fill" />
                <p>{condition.data.attributes.Condition}</p>
              </div>
            )}
          </div>
          {Price && <div className='price'>Listed Price: <b>Ksh {Number(Price).toLocaleString()}</b></div>}
          {seller && seller.data && (
            <div className='seller-details'>
              <div className="seller">
                <p>{seller.data.attributes.Dealers}</p>
                <p><i className='bx bx-phone'> {Contact}</i></p>
              </div>
              {location && location.data && (
                <div className='location'>
                  <i className="bi bi-geo-alt" />
                  <p>{location.data.attributes.Location}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className='desc'>
        {Description && <p>{Description}</p>}
      </div>
    </div>
  );
};

export default VehicleDetails;
