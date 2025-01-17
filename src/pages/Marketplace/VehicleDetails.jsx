import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './VehicleDetails.css';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import SkeletonCard from '../../components/Skeleton/SkeletonCard';
import { useCarListings } from '../../components/CarListingContext/useCarListings';

const VehicleDetails = () => {
  const { id } = useParams();
  const { fetchVehicleDetails } = useCarListings();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const getVehicleDetails = async () => {
      try {
        setLoading(true);
        const vehicleData = await fetchVehicleDetails(id);
        setVehicle(vehicleData);
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
      } finally {
        setLoading(false);
      }
    };

    getVehicleDetails();
  }, [id, fetchVehicleDetails]);

  if (loading) {
    return <SkeletonCard />;
  }

  if (!vehicle) {
    return <p>Loading...</p>;
  }

  const { attributes } = vehicle;
  const { Year, Price, Contact, Description, Gallery, model, fuel, gearbox, seller, condition, location, Name } = attributes;

  const constructImageUrl = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${import.meta.env.DEV ? import.meta.env.VITE_DEV_API_IMAGE_URL : import.meta.env.VITE_PROD_API_IMAGE_URL}${url}`;
  };

  const images = (Gallery?.data || []).map((image) => {
    const mainUrl = image?.attributes?.url;
    const largeUrl = image?.attributes?.formats?.large?.url;
    const mediumUrl = image?.attributes?.formats?.medium?.url;
    const smallUrl = image?.attributes?.formats?.small?.url;
    const thumbnailUrl = image?.attributes?.formats?.thumbnail?.url;

    const originalUrl = mainUrl || largeUrl || mediumUrl || smallUrl;

    if (originalUrl && thumbnailUrl && mainUrl) {
      return {
        original: constructImageUrl(originalUrl),
        thumbnail: constructImageUrl(thumbnailUrl),
        main: constructImageUrl(mainUrl)
      };
    }
    return null;
  }).filter(image => image !== null);

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess('Link copied! Paste anywhere!');
    } catch (err) {
      setCopySuccess('Failed to copy the link');
    }

    setTimeout(() => {
      setCopySuccess('');
    }, 2000);
  };

  return (
    <div className="vehicle-details">
      <div className="vehicle-info">
        {images.length > 0 && (
          <ImageGallery items={images} showPlayButton={false} className="image-gallery" />
        )}
        <div className="description">
          {Year && Name && <h2>{Name}</h2>}
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
          <div className='desc'>
            {Description && <p>{Description}</p>}
          </div>
          {Price && <div className='price'>Listed Price: <b>Ksh {Number(Price).toLocaleString()}</b></div>}
          {seller && seller.data && (
            <div className='seller-details'>
              <div className="seller">
                <p>{seller.data.attributes.Dealers}</p>
                <a href={`tel:${Contact}`} className='contact-button'> {Contact}</a>
              </div>
              {location && location.data && (
                <div className='location'>
                  <i className="bi bi-geo-alt" />
                  <p>{location.data.attributes.Location}</p>
                  <button onClick={handleShareClick} className="share-button"> <i className="bi bi-share-fill"> Share this listing</i></button>
                  {copySuccess && <p className="copy-success">{copySuccess}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
