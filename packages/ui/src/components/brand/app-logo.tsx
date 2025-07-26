import type {ComponentProps} from 'react'

export function AppLogo(props: ComponentProps<'svg'>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="600" 
      height="600" 
      viewBox="0 0 600 600"
      {...props}
    >
      <foreignObject width="100%" height="100%" x="0" y="0">
        <div 
          className="bg-transparent w-screen max-w-full aspect-square md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] xl:w-[600px] xl:h-[600px]"
          style={{
            padding: '38px',
            display: 'block',
            width: '600px',
            height: '600px'
          }}
        >
          <div 
            className="w-full aspect-square overflow-hidden flex justify-center items-center shadow-none"
            style={{
              background: 'rgb(0, 0, 0)',
              borderRadius: '71px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '524px',
              height: '524px',
              overflow: 'hidden'
            }}
          >
            <span style={{ display: 'block', width: '400px', height: '400px' }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="400" 
                height="400" 
                viewBox="0 0 24 24" 
                fill="#ffffff" 
                stroke="#ffffff" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-database-zap"
                style={{ fillOpacity: 0 }}
              >
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5V19A9 3 0 0 0 15 21.84" />
                <path d="M21 5V8" />
                <path d="M21 12L18 17H22L19 22" />
                <path d="M3 12A9 3 0 0 0 14.59 14.87" />
              </svg>
            </span>
          </div>
        </div>
      </foreignObject>
    </svg>
  )
}
