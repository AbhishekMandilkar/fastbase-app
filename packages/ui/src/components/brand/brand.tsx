
import {AppLogo} from './app-logo';

const Brand = (props: {
    showText?: boolean
}) => {
    const {showText = true} = props;
  return (
    <div className="flex items-center gap-2">
      <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-primary-foreground">
        <AppLogo className="size-8" />
      </div>
      {showText && (
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-semibold font-mono text-lg">fastbase</span>
        </div>
      )}
    </div>
  )
}

export default Brand
