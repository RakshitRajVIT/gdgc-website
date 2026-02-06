import { useEffect, useRef, useState } from "react"

const FallingImagesBackground = ({
  images,
  children,
  trigger = "scroll",
  backgroundColor = "transparent",
  gravity = 0.4,
  imageWidth = 80,
  imageHeight = 80,
  bounce = 0.5,
  rotation = true,
  bottomDepth = 0,
  hoverForce = 8,
}) => {
  const containerRef = useRef(null)
  const [effectStarted, setEffectStarted] = useState(false)
  const [fallingImages, setFallingImages] = useState([])
  const animationFrameRef = useRef(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const mousePositionRef = useRef({ x: 0, y: 0 })

  const uniqueImages = useRef(images).current

  useEffect(() => {
    let loadedCount = 0
    const totalImages = uniqueImages.length

    uniqueImages.forEach((src) => {
      const img = new Image()
      img.onload = () => {
        loadedCount++
        if (loadedCount === totalImages) {
          setImagesLoaded(true)
        }
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === totalImages) {
          setImagesLoaded(true)
        }
      }
      img.src = src
    })
  }, [uniqueImages])

  useEffect(() => {
    if (trigger === "auto") {
      if (imagesLoaded) {
        setEffectStarted(true)
      }
      return
    }

    if (trigger === "scroll" && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && imagesLoaded) {
            setEffectStarted(true)
            observer.disconnect()
          }
        },
        { threshold: 0.3 }
      )
      observer.observe(containerRef.current)
      return () => observer.disconnect()
    }
  }, [trigger, imagesLoaded])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    if (!effectStarted || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const width = containerRect.width
    const height = containerRect.height


    const centerX = width / 2
    const centerY = -250

    const initialImages = uniqueImages.map((src, index) => {
      const clusterOffset = 20
      const x = centerX + (Math.random() - 0.5) * clusterOffset
      const y = centerY + (Math.random() - 0.5) * clusterOffset

      const angle = (Math.PI * 2 * index) / uniqueImages.length + (Math.random() - 0.5) * 0.8
      const speed = 5 + Math.random() * 4
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed * 0.4

      return {
        id: index,src,x,y,vx, vy,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
      }
    })

    setFallingImages(initialImages)

    let lastTime = performance.now()

    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 16.67
      lastTime = currentTime

      setFallingImages(prevImages =>
        prevImages.map(img => {
          let newX = img.x + img.vx * deltaTime
          let newY = img.y + img.vy * deltaTime
          let newVx = img.vx
          let newVy = img.vy + gravity * deltaTime
          let newRotation = rotation ? img.rotation + img.rotationSpeed * deltaTime : 0
          let newRotationSpeed = img.rotationSpeed

          const dx = mousePositionRef.current.x - img.x
          const dy = mousePositionRef.current.y - img.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const hoverRadius = 120

          if (distance < hoverRadius && distance > 0) {
            const force = (hoverRadius - distance) / hoverRadius * hoverForce
            const angle = Math.atan2(dy, dx)
            newVx -= Math.cos(angle) * force
            newVy -= Math.sin(angle) * force
            newRotationSpeed += (Math.random() - 0.5) * 2
          }


          newVx *= 0.998
          newVy *= 0.999


          // Keep images fully visible - use full imageHeight as margin from bottom
          const bottomLimit = height - imageHeight - 20
          if (newY >= bottomLimit) {
            newY = bottomLimit
            newVy = Math.abs(newVy) * -bounce
            newVx *= 0.85
            newRotationSpeed *= bounce

            if (Math.abs(newVy) < 0.3) {
              newVy = 0
              newY = bottomLimit
            }
          }


          if (newY - imageHeight / 2 <= 0) {
            newY = imageHeight / 2
            newVy = Math.abs(newVy) * bounce
          }


          if (newX - imageWidth / 2 <= 0) {
            newX = imageWidth / 2
            newVx = Math.abs(newVx) * bounce
          }


          if (newX + imageWidth / 2 >= width) {
            newX = width - imageWidth / 2
            newVx = Math.abs(newVx) * -bounce
          }


          if (Math.abs(newY - bottomLimit) < 1) {
            newVx *= 0.96
            newRotationSpeed *= 0.96
          }

          return {
            ...img,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: newRotation,
            rotationSpeed: newRotationSpeed,
          }
        })
      )

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [effectStarted, gravity, bounce, rotation, imageWidth, imageHeight, uniqueImages, bottomDepth, hoverForce])

  const handleTrigger = () => {
    if (!effectStarted && trigger === "click" && imagesLoaded) {
      setEffectStarted(true)
    }
  }

  return (
    <div
      className="relative w-full h-full"
      onClick={trigger === "click" ? handleTrigger : undefined}
      onKeyDown={e => {
        if (trigger === "click" && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          handleTrigger()
        }
      }}
      ref={containerRef}
      role={trigger === "click" ? "button" : undefined}
      tabIndex={trigger === "click" ? 0 : undefined}
      style={{ backgroundColor, overflow: 'hidden' }}
    >

      <div
        className="absolute z-0"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: `-${bottomDepth}px`,
          pointerEvents: 'none'
        }}
      >
        {effectStarted && fallingImages.map((img) => (
          <img
            key={img.id}
            src={img.src}
            alt=""
            className="select-none pointer-events-none"
            style={{
              position: "absolute",
              left: `${img.x}px`,
              top: `${img.y}px`,
              width: `${imageWidth}px`,
              height: `${imageHeight}px`,
              objectFit: "contain",
              transform: `translate(-50%, -50%) rotate(${img.rotation}deg)`,
              willChange: "transform",
              transition: 'none',
              userSelect: 'none',
            }}
            draggable={false}
          />
        ))}
      </div>


      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  )
}

export default FallingImagesBackground
