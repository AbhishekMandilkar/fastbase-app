import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '../../components/ui/card'
import {Label} from '../../components/ui/label'
import {Input} from '../../components/ui/input'
import {Button} from '../../components/ui/button'

import {Loader2Icon, Plug} from 'lucide-react'
import ImportUrlDialog from './import-url-dialog'
import {useCreateConnection} from './hooks/use-create-connection'

const CreateConnection = () => {
  const {
    importFromUrlDialogOpen,
    handleImportFromUrlDialogOpen,
    urlInput,
    setUrlInput,
    handleImport,
    handleConnect,
    hostInputRef,
    portInputRef,
    userInputRef,
    passwordInputRef,
    databaseInputRef,
    nicknameInputRef,
    isConnecting,
    validationErrors,
  } = useCreateConnection()

  return (
    <div className="w-full mx-auto flex justify-center items-center">
      <Card className="min-w-[40%] bg-primary-foreground">
        <CardHeader>
          <CardTitle>Create PostgreSQL Connection</CardTitle>
          <CardDescription>Create a new connection to a PostgreSQL database</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid w-full items-center gap-4 grid-cols-2">
            <div className="flex flex-col space-y-1.5 col-span-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input 
                id="nickname" 
                ref={nicknameInputRef} 
                placeholder="Enter connection nickname"
                className={validationErrors.nickname ? 'border-red-500' : ''} 
              />
              {validationErrors.nickname && (
                <span className="text-sm text-red-500">{validationErrors.nickname}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="host">Host</Label>
              <Input 
                id="host" 
                ref={hostInputRef} 
                placeholder="localhost"
                className={validationErrors.host ? 'border-red-500' : ''} 
              />
              {validationErrors.host && (
                <span className="text-sm text-red-500">{validationErrors.host}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="port">Port</Label>
              <Input 
                id="port" 
                ref={portInputRef} 
                placeholder="5432"
                className={validationErrors.port ? 'border-red-500' : ''} 
              />
              {validationErrors.port && (
                <span className="text-sm text-red-500">{validationErrors.port}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="user">User</Label>
              <Input 
                id="user" 
                ref={userInputRef} 
                placeholder="Enter username"
                className={validationErrors.user ? 'border-red-500' : ''} 
              />
              {validationErrors.user && (
                <span className="text-sm text-red-500">{validationErrors.user}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                ref={passwordInputRef}
                placeholder="Enter password"
                className={validationErrors.password ? 'border-red-500' : ''} 
              />
              {validationErrors.password && (
                <span className="text-sm text-red-500">{validationErrors.password}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="database">Database</Label>
              <Input 
                id="database" 
                ref={databaseInputRef} 
                placeholder="Enter database name"
                className={validationErrors.database ? 'border-red-500' : ''} 
              />
              {validationErrors.database && (
                <span className="text-sm text-red-500">{validationErrors.database}</span>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <ImportUrlDialog
            isOpen={importFromUrlDialogOpen}
            onOpenChange={handleImportFromUrlDialogOpen}
            urlInput={urlInput}
            onUrlInputChange={(value) => setUrlInput(value)}
            onImport={handleImport}
          />
          <Button
            variant="default"
            onClick={handleConnect}
            disabled={isConnecting}
            className="transition-all duration-300"
          >
            {isConnecting ? <Loader2Icon className="animate-spin" /> : <Plug />}
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CreateConnection
