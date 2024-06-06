import React from 'react'

import { SlidesEditor } from "@/components/slides-editor";

const HomeSlider = () => {
  return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-start lg-grid lg:grid-cols-[500px_minmax(0,1fr)]  md:grid md:grid-cols-[400px_minmax(0,1fr)] ">
          <SlidesEditor />
        </div>
      </div>
  )
}

export default HomeSlider