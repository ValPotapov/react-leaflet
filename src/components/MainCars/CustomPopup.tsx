import React, { FC } from 'react';
import { Popup } from 'react-leaflet';

import 'leaflet-rotatedmarker';

import isHasToushScreen from './lib/isMobile';

interface ICustomPopup {
  speed: string,
}
const CustomPopup: FC<ICustomPopup> = React.memo(({ speed }) => {
  const isMobile = isHasToushScreen()


  // Если использовать action handler для авто открытия popup
  // const [refReady, setRefReady] = useState(false);
  // let popupRef = useRef(null)

  return (isMobile ?
    (<Popup
      autoPan={false}
      // ref={popupRef}
      ref={(r) => {
        // setRefReady(true);
      }}
    >
      <p>{`скорость ${speed} км/ч`}</p>
    </Popup>) : null
  )

})

export default CustomPopup;