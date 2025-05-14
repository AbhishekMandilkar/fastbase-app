import { Loader2 } from 'lucide-react'
import { TypingAnimation } from '@/components/typing-animation'
import * as motion from 'motion/react-client'

// Component imports
import PromptSection from './components/PromptSection'
import ActionBar from './components/ActionBar'
import ResultsDisplay from './components/ResultsDisplay'

// Hook import
import { useChatQuery } from './hooks/useChatQuery'

const ChatView = () => {
  const {
    isLoading,
    isDatabaseStructureLoading,
    isSQLGenerated,
    input,
    query,
    dataResults,
    error,
    table,
    handleInputChange,
    handleSubmit,
    copyQueryToClipboard,
    copyResponseToClipboard
  } = useChatQuery()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col gap-4 justify-center items-center min-w-[calc(100vw-3rem)]"
    >
      <motion.div layout>
        <TypingAnimation
          text="What do you want to know from your data?"
          duration={50}
          className="font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm mb-4"
        />
        {isDatabaseStructureLoading ? (
          <div className="flex-1 flex flex-col gap-4 justify-center items-center">
            <Loader2 className="size-10 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col mx-auto w-full max-w-5xl items-center">
            <PromptSection
              input={input}
              setInput={handleInputChange}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
              isDatabaseStructureLoading={isDatabaseStructureLoading}
            />
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                layout
              >
                <ActionBar
                  query={query}
                  onClickCopyQuery={copyQueryToClipboard}
                  onClickCopyResponse={copyResponseToClipboard}
                  showActionBar={isSQLGenerated}
                />
                <ResultsDisplay
                  error={error}
                  isSQLGenerated={isSQLGenerated}
                  dataResults={dataResults}
                  table={table}
                  query={query}
                  onClickCopyQuery={copyQueryToClipboard}
                />
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default ChatView
