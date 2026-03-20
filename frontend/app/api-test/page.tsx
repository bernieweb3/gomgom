"use client"

import { useState, useEffect } from "react"

interface ApiResult {
  endpoint: string
  status: "loading" | "success" | "error"
  data?: any
  error?: string
}

export default function ApiTestPage() {
  const [results, setResults] = useState<ApiResult[]>([])

  const endpoints = [
    "/api/test-rpc",
    "/api/user/profile/0x1234567890123456789012345678901234567890",
    "/api/user/points/0x1234567890123456789012345678901234567890",
    "/api/user/nfts/0x1234567890123456789012345678901234567890",
    "/api/exchange/pairs",
    "/api/missions/0x1234567890123456789012345678901234567890",
  ]

  useEffect(() => {
    const testEndpoints = async () => {
      const initialResults = endpoints.map(endpoint => ({
        endpoint,
        status: "loading" as const
      }))
      setResults(initialResults)

      for (let i = 0; i < endpoints.length; i++) {
        try {
          const response = await fetch(endpoints[i])
          const data = await response.json()
          
          setResults(prev => prev.map((result, index) => 
            index === i 
              ? { 
                  ...result, 
                  status: response.ok ? "success" : "error",
                  data: response.ok ? data : undefined,
                  error: response.ok ? undefined : data.error || "Unknown error"
                }
              : result
          ))
        } catch (error) {
          setResults(prev => prev.map((result, index) => 
            index === i 
              ? { 
                  ...result, 
                  status: "error",
                  error: error instanceof Error ? error.message : "Network error"
                }
              : result
          ))
        }
      }
    }

    testEndpoints()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Test Results</h1>
      <p className="text-gray-600 mb-8">Testing all API endpoints with real blockchain data</p>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-mono text-sm">{result.endpoint}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                result.status === "loading" ? "bg-yellow-100 text-yellow-800" :
                result.status === "success" ? "bg-green-100 text-green-800" :
                "bg-red-100 text-red-800"
              }`}>
                {result.status}
              </span>
            </div>
            
            {result.status === "loading" && (
              <div className="text-gray-500">Testing...</div>
            )}
            
            {result.status === "error" && (
              <div className="text-red-600 text-sm">
                Error: {result.error}
              </div>
            )}
            
            {result.status === "success" && result.data && (
              <div className="mt-2">
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold text-blue-900 mb-2">Test Summary</h2>
        <div className="text-sm text-blue-800">
          <div>Total Endpoints: {endpoints.length}</div>
          <div>Successful: {results.filter(r => r.status === "success").length}</div>
          <div>Failed: {results.filter(r => r.status === "error").length}</div>
          <div>Loading: {results.filter(r => r.status === "loading").length}</div>
        </div>
      </div>
    </div>
  )
}
