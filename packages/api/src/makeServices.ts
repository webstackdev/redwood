import { context } from './globalContext'
import { MakeServices } from './types'

/**
 * This function is a stub for when we fully introduce the concept of
 * services.
 */
export const makeServices: MakeServices = ({ services }) => {
  const secureServices: any = {}

  for (const [serviceName, service] of Object.entries(services)) {
    secureServices[serviceName] = {}

    for (const [funcName, func] of Object.entries(service)) {
      if (funcName !== 'before') {
        secureServices[serviceName][funcName] = async (
          ...args: Array<unknown>
        ) => {
          if (service.before) {
            const beforeResult = service.before(
              { serviceName: funcName },
              { context }
            )
            if (beforeResult || beforeResult === undefined) {
              const response = await func(...args)
              if (service.after) {
                return service.after({ response }, { context })
              } else {
                return response
              }
            } else {
              throw new Error('Service aborted')
            }
          } else {
            if (service.after) {
              return service.after({ response: func(...args) }, { context })
            } else {
              return func(...args)
            }
          }
        }
      }
    }
  }

  return secureServices
}
