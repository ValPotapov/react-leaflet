// хук не используется}
import { useEffect, useLayoutEffect, useState } from 'react'

type TCarIconState = { width: number, height: number }

const useCarIconSize = (imgUrl: string) => {

  const [carIconSize, setCarIconSize] = useState<TCarIconState>({ width: 0, height: 0 })

  useLayoutEffect(() => {
    var img = new Image();
    img.src = imgUrl

    img.onload = function () {
      var width = img.width;

      var height = img.height;

      const proportions = Math.round(height / width)

      setCarIconSize({ ...carIconSize, height: carIconSize.width * proportions })
      // setMarkerDataLoad(true)

    };

  }, [])


  return [carIconSize, setCarIconSize]
}

export { useCarIconSize }