import { 
  User, 
  InsertUser, 
  CallRecord, 
  InsertCallRecord,
  ApiConfig,
  InsertApiConfig
} from "@shared/schema";

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Call record methods
  getAllCallRecords(): Promise<CallRecord[]>;
  getCallRecord(id: number): Promise<CallRecord | undefined>;
  getCallRecordByCallId(callId: string): Promise<CallRecord | undefined>;
  createCallRecord(record: InsertCallRecord): Promise<CallRecord>;
  updateCallRecord(callId: string, updates: Partial<CallRecord>): Promise<CallRecord>;
  
  // API configuration methods
  getApiConfig(): Promise<ApiConfig | undefined>;
  saveApiConfig(config: InsertApiConfig): Promise<ApiConfig>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private callRecords: Map<number, CallRecord>;
  private apiConfigs: Map<number, ApiConfig>;
  private userId: number;
  private callId: number;
  private configId: number;

  constructor() {
    this.users = new Map();
    this.callRecords = new Map();
    this.apiConfigs = new Map();
    this.userId = 1;
    this.callId = 1;
    this.configId = 1;
    
    // Initialize with some sample call records
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    this.callRecords.set(1, {
      id: 1,
      callId: "call_1",
      agentId: "agent_1",
      agentName: "Customer Support Agent",
      status: "completed",
      duration: "3:42",
      startTime: now,
      endTime: now,
      timestamp: "Today at 2:15 PM"
    });
    
    this.callRecords.set(2, {
      id: 2,
      callId: "call_2",
      agentId: "agent_1",
      agentName: "Customer Support Agent",
      status: "completed",
      duration: "5:17",
      startTime: yesterday,
      endTime: yesterday,
      timestamp: "Yesterday at 11:30 AM"
    });
    
    this.callRecords.set(3, {
      id: 3,
      callId: "call_3",
      agentId: "agent_2",
      agentName: "Product Expert Agent",
      status: "dropped",
      duration: "1:08",
      startTime: lastWeek,
      endTime: lastWeek,
      timestamp: "Nov 12, 2023"
    });
    
    this.callId = 4;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Call record methods
  async getAllCallRecords(): Promise<CallRecord[]> {
    return Array.from(this.callRecords.values())
      .sort((a, b) => (b.startTime?.getTime() || 0) - (a.startTime?.getTime() || 0));
  }
  
  async getCallRecord(id: number): Promise<CallRecord | undefined> {
    return this.callRecords.get(id);
  }
  
  async getCallRecordByCallId(callId: string): Promise<CallRecord | undefined> {
    return Array.from(this.callRecords.values()).find(
      (record) => record.callId === callId,
    );
  }
  
  async createCallRecord(record: InsertCallRecord): Promise<CallRecord> {
    const id = this.callId++;
    const callRecord: CallRecord = { ...record, id };
    this.callRecords.set(id, callRecord);
    return callRecord;
  }
  
  async updateCallRecord(callId: string, updates: Partial<CallRecord>): Promise<CallRecord> {
    const record = await this.getCallRecordByCallId(callId);
    if (!record) {
      throw new Error(`Call record with callId ${callId} not found`);
    }
    
    const updatedRecord = { ...record, ...updates };
    this.callRecords.set(record.id, updatedRecord);
    return updatedRecord;
  }
  
  // API configuration methods
  async getApiConfig(): Promise<ApiConfig | undefined> {
    const configs = Array.from(this.apiConfigs.values())
      .filter(config => config.isActive)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    return configs[0];
  }
  
  async saveApiConfig(config: InsertApiConfig): Promise<ApiConfig> {
    // Deactivate previous configs
    for (const [id, existingConfig] of this.apiConfigs.entries()) {
      if (existingConfig.isActive) {
        this.apiConfigs.set(id, { ...existingConfig, isActive: false });
      }
    }
    
    const id = this.configId++;
    const newConfig: ApiConfig = { 
      ...config, 
      id, 
      isActive: true,
      createdAt: new Date()
    };
    
    this.apiConfigs.set(id, newConfig);
    return newConfig;
  }
}

export const storage = new MemStorage();
